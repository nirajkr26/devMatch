import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from "react-redux"
import { BASE_URL } from '../utils/constant';
import axios from "axios"

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const user = useSelector(store => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
            withCredentials: true,
        });

        const chatMessages = chat?.data?.messages.map((msg) => {
            return {
                firstName: msg?.senderId?.firstName,
                lastName: msg?.senderId?.lastName,
                text: msg?.text
            }
        })
        setMessages(chatMessages)
    }

    useEffect(() => {
        fetchChatMessages();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const newSocket = createSocketConnection();
        setSocket(newSocket);

        newSocket.emit("joinChat", { userId, targetUserId })

        newSocket.on("messageReceived", ({ firstName, lastName, text }) => {
            console.log(firstName + " " + text);
            setMessages((prevMessages) => [...prevMessages, { firstName, lastName, text }]);
        })

        return () => {
            newSocket.disconnect();
            setSocket(null);
        }
    }, [userId, targetUserId])

    const sendMessage = () => {
        if (!socket) return;

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
        <div className='w-2/3 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
            <h1 className='p-5 border-b border-gray-600 text-center text-2xl'>CHAT</h1>
            <div className='flex-1 overflow-y-scroll p-5'>
                {messages.map((msg, index) => {
                    return (
                        <div key={index}>
                            <div className={"chat " + (user.firstName == msg.firstName ? "chat-end" : "chat-start")}>
                                <div className="chat-header">
                                    {`${msg.firstName} ${msg.lastName}`}
                                    {/* <time className= "text-xs opacity-50"></time> */}
                                </div>
                                <div className="chat-bubble">{msg.text}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='p-5 border-t border-gray-600 flex items-center gap-4'>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='flex-1 bg-base-200 border rounded-sm p-2 text-white  ' />
                <button onClick={sendMessage} className='btn btn-secondary'>Send</button>
            </div>
        </div>
    )
}

export default Chat