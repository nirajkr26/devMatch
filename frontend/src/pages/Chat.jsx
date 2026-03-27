import React from 'react';
import { useParams } from 'react-router-dom';
import { DirectMessageIcon } from '../utils/Icons';
import { useChat, ChatHeader, ChatInput, MessageBubble } from '../features/chat';

const Chat = () => {
    const { targetUserId } = useParams();
    
    // Decoupled Logic: The state, RTK Queries, Socket and optimizations all happen inside this hook.
    const {
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
    } = useChat(targetUserId);

    // Scroll optimization for image loads
    const checkScrollAndScrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 400) {
            scrollToBottom();
        }
    };

    return (
        <div className='w-full max-w-5xl mx-auto md:my-6 h-[85vh] md:h-[80vh] flex flex-col shadow-2xl bg-base-300 md:rounded-[2.5rem] overflow-hidden border border-base-200'>
            {/* Modular Header */}
            <ChatHeader targetUser={targetUser} />

            {/* Chat Messages Area */}
            <div 
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-base-100 bg-base-100/30'
            >
                {/* Sentinel for Reverse Infinite Scroll */}
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
                            <MessageBubble 
                                key={index}
                                msg={msg}
                                isSender={isSender}
                                userPhotoUrl={user?.photoUrl}
                                targetUserPhotoUrl={targetUser?.photoUrl}
                                onImageLoad={checkScrollAndScrollToBottom}
                            />
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Modular Input Area */}
            <ChatInput 
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                isUploading={isUploading}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
            />
        </div>
    )
}

export default Chat;