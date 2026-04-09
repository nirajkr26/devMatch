import React from 'react';

const MessageBubbleComponent = ({ msg, isSender, userPhotoUrl, targetUserPhotoUrl, onImageLoad, onImageClick }) => {
    const resolvedFileName = React.useMemo(() => {
        if (msg.fileName) return msg.fileName;
        if (!msg.fileUrl) return "file";
        try {
            const pathname = new URL(msg.fileUrl).pathname;
            return decodeURIComponent(pathname.split("/").pop() || "file");
        } catch {
            return "file";
        }
    }, [msg.fileName, msg.fileUrl]);

    const displayTime = React.useMemo(() => (
        msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
    ), [msg.createdAt]);

    return (
        <div className={"chat " + (isSender ? "chat-end" : "chat-start") + " group animate-fadeInUp"}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-xl shadow-lg ring-2 ring-base-100 ring-offset-2 ring-offset-base-300 overflow-hidden bg-base-300">
                    <img src={(isSender ? userPhotoUrl : targetUserPhotoUrl) || "/default-avatar.png"} alt="avatar" />
                </div>
            </div>
            <div className={"chat-header mb-1 mx-2 flex items-center gap-2 " + (msg.status === "pending" ? "opacity-40" : "")}>
                <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>
                    {isSender ? "You" : `${msg.firstName}`}
                </span>
                <time className="text-[9px] opacity-20 font-bold group-hover:opacity-60 transition-opacity flex items-center gap-1">
                    {displayTime}
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
                            onLoad={onImageLoad}
                            onClick={() => msg.fileUrl && onImageClick?.(msg.fileUrl)}
                        />
                        {msg.status === "pending" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border border-white/20">
                                <span className="loading loading-spinner text-white w-8 h-8"></span>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest mt-2 drop-shadow-md">Optimizing</p>
                            </div>
                        )}
                    </div>
                ) : msg.messageType === "file" ? (
                    <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 underline underline-offset-2 break-all"
                    >
                        <span>Download</span>
                        <span>{resolvedFileName}</span>
                    </a>
                ) : (
                    msg.text
                )}
            </div>
        </div>
    );
};

export const MessageBubble = React.memo(MessageBubbleComponent, (prevProps, nextProps) =>
    (prevProps.msg === nextProps.msg || (
        prevProps.msg?._id === nextProps.msg?._id &&
        prevProps.msg?.status === nextProps.msg?.status &&
        prevProps.msg?.text === nextProps.msg?.text &&
        prevProps.msg?.fileUrl === nextProps.msg?.fileUrl &&
        prevProps.msg?.fileName === nextProps.msg?.fileName &&
        prevProps.msg?.messageType === nextProps.msg?.messageType &&
        prevProps.msg?.senderId === nextProps.msg?.senderId &&
        prevProps.msg?.createdAt === nextProps.msg?.createdAt &&
        prevProps.msg?.firstName === nextProps.msg?.firstName
    )) &&
    prevProps.isSender === nextProps.isSender &&
    prevProps.userPhotoUrl === nextProps.userPhotoUrl &&
    prevProps.targetUserPhotoUrl === nextProps.targetUserPhotoUrl &&
    prevProps.onImageLoad === nextProps.onImageLoad &&
    prevProps.onImageClick === nextProps.onImageClick
);
