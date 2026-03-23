import React from 'react'
import { useGetConnectionsQuery } from '../utils/apiSlice'
import { Link } from "react-router-dom";

const Connections = () => {
    const { data, isLoading } = useGetConnectionsQuery();
    const connections = data?.data;

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto my-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-base-300 w-full h-32 rounded-3xl animate-pulse border border-base-200"></div>
                ))}
            </div>
        );
    }

    if (!connections || connections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="p-10 rounded-full bg-base-300 shadow-xl border border-base-200 mb-8 animate-pulse">
                    <span className="text-6xl" role="img" aria-label="Shake hands">🤝</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Network is Quiet</h2>
                <p className="opacity-60 max-w-sm mx-auto text-lg leading-relaxed">Your professional circle is waiting to grow! Explore the developer feed to find your next co-builder.</p>
                <Link to="/feed" className="btn btn-primary btn-lg mt-10 rounded-full px-12 shadow-xl shadow-primary/20 hover:scale-105 transition-all">Go to Feed</Link>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10 px-6 sm:px-10 pb-20'>
            {/* Page Header with Stats */}
            <div className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-base-200 pb-8'>
                <div className="text-center md:text-left">
                    <h1 className='text-4xl md:text-6xl font-black tracking-tighter text-base-content uppercase leading-none'>Your Network</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                        <div className="px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] md:text-xs font-black uppercase tracking-widest border border-primary/20">
                            Professional Connections
                        </div>
                        <span className="text-xl md:text-2xl font-black text-primary">{connections.length}</span>
                    </div>
                </div>
            </div>

            {/* Grid display with 3 columns on large screens to fill empty space */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8'>
                {connections.map((connection) => {
                    const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = connection;

                    return (
                        <div
                            key={_id}
                            className="group bg-base-300 rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-base-200 flex flex-col justify-between overflow-hidden relative"
                        >
                            {/* Decorative background element on hover */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                            <div className="flex flex-col items-center text-center gap-5">
                                <div className="relative group/photo">
                                    <img
                                        alt="profile"
                                        className="rounded-3xl w-20 h-20 md:w-24 md:h-24 object-cover ring-4 ring-base-100 group-hover:ring-primary/40 transition-all duration-700 shadow-xl"
                                        src={photoUrl || "/default-avatar.png"}
                                    />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-success border-2 border-base-300 rounded-full shadow-lg"></div>
                                </div>

                                <div className="w-full">
                                    <h2 className="font-black text-xl md:text-2xl tracking-tighter text-base-content truncate">
                                        {firstName} {lastName}
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2 py-0.5 bg-base-100 rounded-md border border-base-200">{gender}</span>
                                        {age && <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2 py-0.5 bg-base-100 rounded-md border border-base-200">{age} Years</span>}
                                    </div>
                                    <p className="text-xs line-clamp-2 opacity-60 italic px-2 mb-3">
                                        "{about || "Saying hello to the world!"}"
                                    </p>
                                    {/* Skills for connection cards */}
                                    {skills && skills.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                                            {skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="badge badge-ghost badge-sm text-[8px] font-black uppercase tracking-tighter py-2 border-base-200">{skill}</span>
                                            ))}
                                            {skills.length > 3 && <span className="text-[10px] opacity-30 font-black">+{skills.length - 3}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center w-full">
                                <Link to={"/chat/" + _id} className='w-full'>
                                    <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-3 lowercase italic font-black text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Let's Chat
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Decorative bottom decoration to fill vertical whitespace */}
            {connections.length > 0 && (
                <div className="mt-20 pt-10 border-t border-base-200 flex justify-center opacity-10">
                    <span className="text-xs font-black uppercase tracking-[1em]">devMatch Network</span>
                </div>
            )}
        </div>
    )
}

export default Connections;