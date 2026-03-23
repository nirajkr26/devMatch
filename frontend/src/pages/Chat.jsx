import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from "react-redux"
import { ArrowLeftIcon, DirectMessageIcon, AttachmentIcon, PaperPlaneIcon } from '../utils/Icons';
import { useGetChatQuery, useGetConnectionsQuery } from '../utils/apiSlice'

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [targetUser, setTargetUser] = useState(null);

    const user = useSelector(store => store.user);
    const connections = useSelector(store => store.connections);
    const userId = user?._id;
    const messagesEndRef = useRef(null);

    // Connections & Chat History retrieval
    const { data: sessionConnections } = useGetConnectionsQuery();
    const { data: chatHistory, isLoading } = useGetChatQuery(targetUserId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
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

    // Sync query data with local state for socket integration
    useEffect(() => {
        if (chatHistory) {
            setMessages(chatHistory);
        }
    }, [chatHistory]);

    // Handle target user info with fallbacks
    useEffect(() => {
        const locallyFound = findTargetUser();
        if (locallyFound) {
            setTargetUser(locallyFound);
        } else if (chatHistory && chatHistory.length > 0) {
            // Fallback: extract other person's details from chat messages
            const opponentMsg = chatHistory.find(m => m.senderId === targetUserId);
            if (opponentMsg) {
                setTargetUser({
                    firstName: opponentMsg.firstName,
                    lastName: opponentMsg.lastName,
                    photoUrl: opponentMsg.photoUrl,
                    _id: targetUserId
                });
            }
        }
    }, [targetUserId, connections, chatHistory, sessionConnections]);

    // Socket Connection Setup
    useEffect(() => {
        if (!userId) return;

        const newSocket = createSocketConnection();
        setSocket(newSocket);
        newSocket.emit("joinChat", { userId, targetUserId })

        newSocket.on("messageReceived", ({ senderId, firstName, lastName, text }) => {
            setMessages((prevMessages) => [...prevMessages, {
                senderId,
                firstName,
                lastName,
                text,
                createdAt: new Date()
            }]);
        })

        return () => {
            newSocket.disconnect();
            setSocket(null);
        }
    }, [userId, targetUserId])

    const sendMessage = () => {
        if (!socket || !newMessage.trim()) return;

        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: newMessage
        })
        setNewMessage("");
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
            <div className='flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-base-100 bg-base-100/30'>
                {isLoading ? (
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
                                <div className="chat-header mb-1 mx-2 flex items-center gap-2">
                                    <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>
                                        {isSender ? "You" : `${msg.firstName}`}
                                    </span>
                                    <time className="text-[9px] opacity-20 font-bold group-hover:opacity-60 transition-opacity">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                    </time>
                                </div>
                                <div className={"chat-bubble py-3 px-5 shadow-xl leading-relaxed text-sm md:text-base transition-all " +
                                    (isSender
                                        ? "bg-primary text-white rounded-br-none font-medium"
                                        : "bg-base-300 text-base-content rounded-bl-none border border-base-200")}>
                                    {msg.text}
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
                    <button className='btn btn-circle btn-ghost opacity-40 hover:opacity-100 hover:text-primary transition-all hidden sm:flex'>
                        <AttachmentIcon className="w-6 h-6" />
                    </button>
                    <textarea
                        rows="1"
                        value={newMessage}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share a thought..."
                        className='flex-1 bg-transparent border-none focus:outline-none py-3 px-2 text-base-content placeholder:opacity-30 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em] resize-none overflow-hidden max-h-32'
                    />
                    <button
                        onClick={sendMessage}
                        className={`btn btn-circle btn-primary shadow-lg shadow-primary/20 transition-all duration-300 ${!newMessage.trim() ? "opacity-20 scale-90" : "scale-110 active:scale-95"}`}
                    >
                        <PaperPlaneIcon className="w-5 h-5 translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;