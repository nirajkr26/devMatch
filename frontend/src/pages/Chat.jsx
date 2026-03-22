import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from "react-redux"
import { BASE_URL } from '../utils/constant';
import axios from "axios"

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const findTargetUser = () => {
        // Method 1: Check connections in Redux
        if (connections) {
            const found = connections.find(c => c._id === targetUserId);
            if (found) return found;
        }
        return null;
    }

    const fetchChatMessages = async () => {
        try {
            // First, try to get user info from connections (fastest)
            const localUser = findTargetUser();
            if (localUser) {
                setTargetUser(localUser);
            }

            const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
                withCredentials: true,
            });

            const chatMessages = chat?.data?.messages.map((msg) => {
                return {
                    senderId: msg?.senderId?._id,
                    firstName: msg?.senderId?.firstName,
                    lastName: msg?.senderId?.lastName,
                    photoUrl: msg?.senderId?.photoUrl,
                    text: msg?.text,
                    createdAt: msg?.createdAt
                }
            })
            setMessages(chatMessages)

            // Method 2: If still no user info, try to extract it from messages
            if (!localUser) {
                const otherPerson = chat?.data?.messages?.find(m => m.senderId?._id === targetUserId)?.senderId;
                if (otherPerson) setTargetUser(otherPerson);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchChatMessages();
    }, [targetUserId, connections]);

    useEffect(() => {
        if (!userId) return;

        const newSocket = createSocketConnection();
        setSocket(newSocket);

        newSocket.emit("joinChat", { userId, targetUserId })

        newSocket.on("messageReceived", ({ senderId, firstName, lastName, text }) => {
            setMessages((prevMessages) => [...prevMessages, { senderId, firstName, lastName, text, createdAt: new Date() }]);
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
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
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
                        <div className="p-8 rounded-full bg-base-200 border border-base-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-primary opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Your professional journey starts with a hello.</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isSender = userId === msg.senderId;
                    return (
                        <div key={index} className={"chat " + (isSender ? "chat-end" : "chat-start") + " group animate-fadeInUp"}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-xl shadow-lg ring-2 ring-base-100 ring-offset-2 ring-offset-base-300 overflow-hidden bg-base-300">
                                    {isSender ? (
                                        <img src={user?.photoUrl || "/default-avatar.png"} alt="me" />
                                    ) : (
                                        <img src={targetUser?.photoUrl || "/default-avatar.png"} alt="other" />
                                    )}
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
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className='bg-base-300 p-4 md:p-6 border-t border-base-200'>
                <div className='flex items-end gap-3 max-w-4xl mx-auto bg-base-100 rounded-[1.5rem] p-2 pr-3 border border-base-200 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                    <button className='btn btn-circle btn-ghost opacity-40 hover:opacity-100 hover:text-primary transition-all hidden sm:flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.767 14.532a1.5 1.5 0 01-2.121-2.121l7.071-7.071" /></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;