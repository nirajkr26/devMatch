import { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { createSocketConnection } from '../../../utils/socket';
import { useGetChatQuery, useGetConnectionsQuery, useSignChatUploadMutation } from '../../../utils/apiSlice';
import imageCompression from 'browser-image-compression';
import React from 'react';

export const useChat = (targetUserId) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [before, setBefore] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const user = useSelector(store => store.user);
    const connections = useSelector(store => store.connections);
    const userId = user?._id;
    
    // Refs
    const messagesEndRef = useRef(null);
    const sentinelRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // For manual scroll anchoring
    const prevScrollHeightRef = useRef(0);
    const prevMessagesLenRef = useRef(0);

    const { data: sessionConnections } = useGetConnectionsQuery();
    const { data: chatData, isLoading, isFetching } = useGetChatQuery({ targetUserId, before }, {
        skip: !targetUserId
    });
    
    const [signChatUpload] = useSignChatUploadMutation();

    const chatMessages = chatData?.messages || [];
    const hasMore = chatData?.hasMore ?? true;

    // Handle Intersection Observer for the Sentinel (top of list)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching && !isLoading && hasMore && messages.length > 0) {
                    if (chatContainerRef.current) {
                        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
                    }
                    setBefore(messages[0]._id);
                }
            },
            { threshold: 0.1 }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) observer.observe(currentSentinel);

        return () => {
            if (currentSentinel) observer.unobserve(currentSentinel);
        };
    }, [messages, isFetching, isLoading, hasMore]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Advanced Scroll Anchoring
    React.useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container || messages.length === 0) return;

        const wasPrepend = messages.length > prevMessagesLenRef.current && prevMessagesLenRef.current > 0 && !initialLoad;
        
        if (wasPrepend && prevScrollHeightRef.current > 0) {
            const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
            container.scrollTop += heightDiff;
        } else if (initialLoad) {
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
            setInitialLoad(false);
        } else {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom) {
                scrollToBottom();
            }
        }

        prevMessagesLenRef.current = messages.length;
    }, [messages]);

    const findTargetUser = () => {
        const connectionsArr = sessionConnections?.data || connections;
        if (connectionsArr) {
            const found = connectionsArr.find(c => c._id === targetUserId);
            if (found) return found;
        }
        return null;
    }

    // Reset local state when switching to a different user's chat
    useEffect(() => {
        setMessages([]);
        setBefore("");
        setInitialLoad(true);
        prevMessagesLenRef.current = 0;
        prevScrollHeightRef.current = 0;
        setTargetUser(null);
    }, [targetUserId]);

    // Intelligent sync
    useEffect(() => {
        setMessages(prevLocalMessages => {
            if (chatMessages.length === 0) return prevLocalMessages;
            if (prevLocalMessages.length === 0) return chatMessages;

            const fetchedIds = new Set(chatMessages.map(m => m._id));
            const newlyAddedLocalMessages = prevLocalMessages.filter(m => !fetchedIds.has(m._id));
            
            return [...chatMessages, ...newlyAddedLocalMessages];
        });
    }, [chatMessages]);

    // Handle target user info with fallbacks
    useEffect(() => {
        const locallyFound = findTargetUser();
        if (locallyFound) {
            setTargetUser(locallyFound);
        } else if (chatMessages.length > 0) {
            const opponentMsg = chatMessages.find(m => m.senderId === targetUserId);
            if (opponentMsg) {
                setTargetUser({
                    firstName: opponentMsg.firstName,
                    lastName: opponentMsg.lastName,
                    photoUrl: opponentMsg.photoUrl,
                    _id: targetUserId
                });
            }
        }
    }, [targetUserId, connections, chatMessages, sessionConnections]);

    // Socket Connection Setup
    useEffect(() => {
        if (!userId || !targetUserId) return;

        const newSocket = createSocketConnection();
        setSocket(newSocket);
        newSocket.emit("joinChat", { userId, targetUserId });

        newSocket.on("messageReceived", ({ senderId, firstName, lastName, text, messageType, fileUrl, tempId }) => {
            setMessages((prevMessages) => [...prevMessages, {
                senderId,
                firstName,
                lastName,
                text,
                messageType: messageType || "text",
                fileUrl,
                status: "sent",
                createdAt: new Date()
            }]);
        });

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [userId, targetUserId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        try {
            setIsUploading(true);
            
            const localBlobUrl = URL.createObjectURL(file);
            const tempId = crypto.randomUUID();

            const optimisticMsg = {
                _id: tempId,
                senderId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                text: "",
                messageType: "image",
                fileUrl: localBlobUrl,
                status: "pending",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, optimisticMsg]);

            const compressedBlob = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                initialQuality: 0.7
            });

            const { data: signData } = await signChatUpload();
            
            const formData = new FormData();
            formData.append("file", compressedBlob);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append("folder", signData.folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
                { method: "POST", body: formData }
            );
            const uploadResult = await uploadRes.json();

            sendMessage("image", uploadResult.secure_url, tempId);

            URL.revokeObjectURL(localBlobUrl);
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Image upload failed:", err);
            setIsUploading(false);
        }
    }

    const sendMessage = (type = "text", fileUrl = null, existingTempId = null) => {
        if (!socket || (type === "text" && !newMessage.trim())) return;

        const tempId = existingTempId || crypto.randomUUID();
        const msgText = type === "text" ? newMessage : "";
        
        if (type === "text") {
            const optimisticMsg = {
                _id: tempId,
                senderId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                text: msgText,
                messageType: type,
                fileUrl: fileUrl,
                status: "pending",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setNewMessage("");
        }

        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: msgText,
            messageType: type,
            fileUrl,
            tempId
        }, (ack) => {
            if (ack.status === "ok") {
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, _id: ack._id, status: "sent", fileUrl: fileUrl || m.fileUrl } : m
                ));
            } else {
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, status: "error" } : m
                ));
            }
        });
    }

    return {
        messages,
        newMessage,
        setNewMessage,
        targetUser,
        isFetching,
        isLoading,
        hasMore,
        isUploading,
        chatContainerRef,
        sentinelRef,
        messagesEndRef,
        fileInputRef,
        handleFileUpload,
        sendMessage,
        scrollToBottom,
        userId,
        user
    };
};
