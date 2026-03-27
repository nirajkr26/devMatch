import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from "react-redux"
import { ArrowLeftIcon, DirectMessageIcon, AttachmentIcon, PaperPlaneIcon } from '../utils/Icons';
import { useGetChatQuery, useGetConnectionsQuery, useSignChatUploadMutation } from '../utils/apiSlice'
import imageCompression from 'browser-image-compression';

const Chat = () => {
    const { targetUserId } = useParams();
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
    const messagesEndRef = useRef(null);
    const sentinelRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const [signChatUpload] = useSignChatUploadMutation();
    
    // For manual scroll anchoring
    const prevScrollHeightRef = useRef(0);
    const prevMessagesLenRef = useRef(0);

    // Connections & Chat History retrieval
    const { data: sessionConnections } = useGetConnectionsQuery();
    const { data: chatData, isLoading, isFetching } = useGetChatQuery({ targetUserId, before }, {
        skip: !targetUserId
    });

    // Derive values from the RTK cache object
    const chatMessages = chatData?.messages || [];
    const hasMore = chatData?.hasMore ?? true;

    // Handle Intersection Observer for the Sentinel (top of list)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching && !isLoading && hasMore && messages.length > 0) {
                    // Save scroll state BEFORE triggering the fetch
                    if (chatContainerRef.current) {
                        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
                    }
                    // Fetch older messages using the oldest message ID
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
            // Older messages were prepended: anchor the scroll position
            const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
            container.scrollTop += heightDiff;
        } else if (initialLoad) {
            // Initial load -> scroll to bottom
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
            setInitialLoad(false);
        } else {
            // New message sent/received -> scroll to bottom only if already near bottom
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom) {
                scrollToBottom();
            }
        }

        prevMessagesLenRef.current = messages.length;
    }, [messages]);


    const findTargetUser = () => {
        // First priority: Query data (current sessions)
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

    // Intelligent sync: Merges RTK query data (infinite scroll history) with local optimisitic 
    // messages (WebSocket real-time traffic).
    useEffect(() => {
        setMessages(prevLocalMessages => {
            if (chatMessages.length === 0) return prevLocalMessages;
            if (prevLocalMessages.length === 0) return chatMessages;

            // Extract all incoming IDs from the RTK cache
            const fetchedIds = new Set(chatMessages.map(m => m._id));
            
            // Keep local messages that the server hasn't given us via API yet 
            // (e.g. ones just sent/received through web-socket in the current session)
            const newlyAddedLocalMessages = prevLocalMessages.filter(m => !fetchedIds.has(m._id));
            
            // We prepend older history, and append the latest socket traffic
            return [...chatMessages, ...newlyAddedLocalMessages];
        });
    }, [chatMessages]);

    // Handle target user info with fallbacks
    useEffect(() => {
        const locallyFound = findTargetUser();
        if (locallyFound) {
            setTargetUser(locallyFound);
        } else if (chatMessages.length > 0) {
            // Fallback: extract other person's details from chat messages
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
        if (!userId) return;

        const newSocket = createSocketConnection();
        setSocket(newSocket);
        newSocket.emit("joinChat", { userId, targetUserId })

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
        })

        return () => {
            newSocket.disconnect();
            setSocket(null);
        }
    }, [userId, targetUserId])

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        try {
            setIsUploading(true);
            
            // 1. Create a local preview for Optimistic UI
            const localBlobUrl = URL.createObjectURL(file);
            const tempId = crypto.randomUUID();

            const optimisticMsg = {
                _id: tempId,
                senderId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                text: "",
                messageType: "image",
                fileUrl: localBlobUrl, // Use local blob for instant feedback
                status: "pending",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // 2. Perform compression using browser-image-compression (< 500KB)
            const compressedBlob = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                initialQuality: 0.7
            });

            // 3. Request Signature from Backend
            const { data: signData } = await signChatUpload();
            
            // 4. Direct Upload to Cloudinary (No API Secret on frontend!)
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

            // 5. Emit via WebSocket
            sendMessage("image", uploadResult.secure_url, tempId);

            // Clean up resources
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
        
        // 1. Optimistic Update (Only for text, image is already added)
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

        // 2. Socket Emission with Acknowledgment Callback
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
                // 3. Reconciliation (Update pending message with server ID and real URL)
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, _id: ack._id, status: "sent", fileUrl: fileUrl || m.fileUrl } : m
                ));
            } else {
                // 4. Error Handling
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, status: "error" } : m
                ));
            }
        });
    }

    return (
        <div className='w-full max-w-5xl mx-auto md:my-6 h-[85vh] md:h-[80vh] flex flex-col shadow-2xl bg-base-300 md:rounded-[2.5rem] overflow-hidden border border-base-200'>
            {/* Chat Header */}
            <div className='px-6 py-4 bg-base-300 border-b border-base-200 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link to="/connections" className='md:hidden btn btn-ghost btn-circle btn-sm'>
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div className="avatar online placeholder hover:scale-105 transition-transform duration-300">
                        <div className="w-12 rounded-2xl bg-base-100 ring-2 ring-base-200 overflow-hidden shadow-md">
                            {targetUser?.photoUrl ? (
                                <img src={targetUser.photoUrl} alt="avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black uppercase text-xl italic">
                                    {targetUser?.firstName?.[0] || "?"}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className='font-black text-lg tracking-tight text-base-content leading-none mb-1 uppercase'>
                            {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Direct Message"}
                        </h2>
                        <div className='flex items-center gap-2'>
                            <span className='w-2 h-2 bg-success rounded-full animate-pulse'></span>
                            <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>Active Professional</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div 
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-base-100 bg-base-100/30'
            >
                {/* Sentinel for Infinite Scroll */}
                <div ref={sentinelRef} className="h-1 w-full flex items-center justify-center opacity-50">
                    {isFetching && hasMore && messages.length > 0 && (
                        <span className="loading loading-spinner text-primary w-4 h-4 mt-2"></span>
                    )}
                </div>

                {isLoading && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <span className="loading loading-ring loading-lg text-primary opacity-20"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Loading Archive</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
                        <div className="p-8 rounded-full bg-base-200 border border-base-300">
                            <DirectMessageIcon className="w-12 h-12 text-primary opacity-50" />
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Your professional journey starts with a hello.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isSender = userId === msg.senderId;
                        return (
                            <div key={index} className={"chat " + (isSender ? "chat-end" : "chat-start") + " group animate-fadeInUp"}>
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-xl shadow-lg ring-2 ring-base-100 ring-offset-2 ring-offset-base-300 overflow-hidden bg-base-300">
                                        <img src={(isSender ? user?.photoUrl : targetUser?.photoUrl) || "/default-avatar.png"} alt="avatar" />
                                    </div>
                                </div>
                                <div className={"chat-header mb-1 mx-2 flex items-center gap-2 " + (msg.status === "pending" ? "opacity-40" : "")}>
                                    <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>
                                         {isSender ? "You" : `${msg.firstName}`}
                                     </span>
                                     <time className="text-[9px] opacity-20 font-bold group-hover:opacity-60 transition-opacity flex items-center gap-1">
                                         {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                         {isSender && (
                                             <span className="scale-75 translate-y-[-1px]">
                                                 {msg.status === "pending" && <span className="loading loading-spinner w-3 h-3"></span>}
                                                 {msg.status === "error" && <span className="text-error text-[10px] font-black">X</span>}
                                             </span>
                                         )}
                                     </time>
                                 </div>
                                 <div className={"chat-bubble py-3 px-5 shadow-xl leading-relaxed text-sm md:text-base transition-all " +
                                     (isSender
                                         ? `bg-primary text-white rounded-br-none font-medium ${msg.status === "pending" && msg.messageType === "text" ? "opacity-70 animate-pulse" : ""} ${msg.status === "error" ? "border-2 border-error !bg-error/10 text-error" : ""}`
                                         : "bg-base-300 text-base-content rounded-bl-none border border-base-200")}>
                                     
                                     {msg.messageType === "image" ? (
                                         <div className="relative group/img my-1">
                                             <img 
                                                 src={msg.fileUrl?.startsWith("blob:") 
                                                     ? msg.fileUrl 
                                                     : msg.fileUrl?.replace("/upload/", "/upload/w_600,c_limit,q_auto,f_auto/")
                                                 } 
                                                 alt="Shared media" 
                                                 className="rounded-xl max-w-full sm:max-w-[18rem] cursor-zoom-in hover:brightness-110 transition-all duration-500 shadow-2xl border border-white/10"
                                                 onLoad={() => {
                                                     const container = chatContainerRef.current;
                                                     if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 400) {
                                                         scrollToBottom();
                                                     }
                                                 }}
                                             />
                                             {msg.status === "pending" && (
                                                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border border-white/20">
                                                     <span className="loading loading-spinner text-white w-8 h-8"></span>
                                                     <p className="text-[10px] font-black text-white uppercase tracking-widest mt-2 drop-shadow-md">Optimizing</p>
                                                 </div>
                                             )}
                                         </div>
                                     ) : (
                                         msg.text
                                     )}
                                 </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className='bg-base-300 p-4 md:p-6 border-t border-base-200'>
                <div className='flex items-end gap-3 max-w-4xl mx-auto bg-base-100 rounded-[1.5rem] p-2 pr-3 border border-base-200 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className='btn btn-circle btn-ghost opacity-40 hover:opacity-100 hover:text-primary transition-all hidden sm:flex'
                        disabled={isUploading}
                    >
                        <AttachmentIcon className="w-6 h-6" />
                    </button>
                    <textarea
                        rows="1"
                        value={newMessage}
                        disabled={isUploading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isUploading ? "Uploading media..." : "Share a thought..."}
                        className='flex-1 bg-transparent border-none focus:outline-none py-3 px-2 text-base-content placeholder:opacity-30 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em] resize-none overflow-hidden max-h-32'
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!newMessage.trim() || isUploading}
                        className={`btn btn-circle btn-primary shadow-lg shadow-primary/20 transition-all duration-300 ${(!newMessage.trim() || isUploading) ? "opacity-20 scale-90" : "scale-110 active:scale-95"}`}
                    >
                        <PaperPlaneIcon className="w-5 h-5 translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;