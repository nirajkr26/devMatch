import React, { useState } from 'react'
import { useGetRequestsQuery, useGetSentRequestsQuery, useReviewConnectionRequestMutation, useWithdrawConnectionRequestMutation } from '../utils/apiSlice'
import { Link } from 'react-router-dom'

const Requests = () => {
    const [activeTab, setActiveTab] = useState('received');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4; 

    const { data: receivedData, isLoading: isLoadingReceived } = useGetRequestsQuery({ page: currentPage, limit });
    const { data: sentData, isLoading: isLoadingSent } = useGetSentRequestsQuery({ page: currentPage, limit });
    const [reviewConnectionRequest] = useReviewConnectionRequestMutation();
    const [withdrawConnectionRequest] = useWithdrawConnectionRequestMutation();
    
    const receivedRequests = receivedData?.data || [];
    const sentRequests = sentData?.data || [];

    const handleReview = async (status, requestId) => {
        try {
            await reviewConnectionRequest({ status, requestId }).unwrap();
        } catch (err) {
            console.error(err.response?.data || err.message)
        }
    }

    const handleWithdraw = async (requestId) => {
        try {
            await withdrawConnectionRequest(requestId).unwrap();
        } catch (err) {
            console.error(err.response?.data || err.message)
        }
    }

    const isLoading = isLoadingReceived || isLoadingSent;
    const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
                <div className="flex justify-center gap-4 mb-8">
                    <div className="h-12 w-32 bg-base-300 rounded-2xl animate-pulse"></div>
                    <div className="h-12 w-32 bg-base-300 rounded-2xl animate-pulse"></div>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-base-300 w-full h-32 rounded-[2.5rem] animate-pulse border border-base-200"></div>
                ))}
            </div>
        );
    }

    // Page Header & Tabs
    const Header = () => (
        <div className='mb-12'>
            <div className='flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 mb-10'>
                <div className='text-center lg:text-left'>
                    <h1 className='text-3xl md:text-4xl font-black tracking-tighter text-base-content uppercase'>
                        {activeTab === 'received' ? 'Incoming Requests' : 'Withdraw Requests'}
                    </h1>
                    <div className="h-1.5 w-24 bg-secondary rounded-full mt-3 mx-auto lg:mx-0"></div>
                    <p className="text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">
                        {currentRequests.length} {activeTab === 'received' ? 'Potential Collaborators' : 'Pending Approvals'}
                    </p>
                </div>

                <div className="tabs tabs-box bg-base-300 p-1.5 rounded-[2rem] border border-base-200 shadow-inner">
                    <button 
                        className={`tab h-12 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'received' ? 'tab-active bg-secondary text-secondary-content shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                        onClick={() => { setActiveTab('received'); setCurrentPage(1); }}
                    >
                        Received ({receivedRequests.length})
                    </button>
                    <button 
                        className={`tab h-12 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'sent' ? 'tab-active bg-secondary text-secondary-content shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                        onClick={() => { setActiveTab('sent'); setCurrentPage(1); }}
                    >
                        Sent ({sentRequests.length})
                    </button>
                </div>
            </div>
        </div>
    );

    if (currentRequests.length === 0) {
        return (
            <div className='max-w-4xl mx-auto my-10 px-4 sm:px-10 pb-20'>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 bg-base-300/30 rounded-[3rem] border border-dashed border-base-content/10">
                    <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center mb-6 shadow-xl border border-base-200">
                        <span className="text-4xl" role="img" aria-label="Inbox icon">
                            {activeTab === 'received' ? '📥' : '📤'}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-base-content mb-3">
                        {activeTab === 'received' ? 'Inbox Clean!' : 'No Sent Requests'}
                    </h2>
                    <p className="opacity-60 max-w-sm mx-auto text-sm font-medium">
                        {activeTab === 'received' 
                            ? "No pending connection requests at the moment. You're all caught up!" 
                            : "You haven't sent any invitations yet. Start exploring the network!"}
                    </p>
                    <Link to="/feed" className="btn btn-secondary btn-outline btn-md mt-8 rounded-full px-10 border-2 hover:scale-105 transition-all font-black uppercase text-xs tracking-widest">
                        Explore Developers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto my-10 px-4 sm:px-10 pb-20'>
            <Header />

            <div className='space-y-6'>
                {currentRequests.map((request) => {
                    // Extract user info based on active tab
                    const userData = activeTab === 'received' ? request.fromUserId : request.toUserId;
                    const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = userData;

                    return (
                        <div
                            key={request._id}
                            className="group bg-base-300 rounded-[2.5rem] p-6 shadow-xl hover:shadow-secondary/5 transition-all duration-300 border border-base-200 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-5 w-full overflow-hidden">
                                <div className="shrink-0 relative">
                                    <img
                                        alt="profile"
                                        className="rounded-3xl w-20 h-20 md:w-24 md:h-24 object-cover ring-2 ring-base-200 group-hover:ring-secondary/40 transition-all duration-500"
                                        src={photoUrl || "/default-avatar.png"}
                                    />
                                    {activeTab === 'received' && (
                                        <div className="absolute -top-1 -right-1 badge badge-secondary badge-xs p-1.5 border-4 border-base-300 shadow-lg"></div>
                                    )}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h2 className="font-black text-xl md:text-2xl tracking-tight text-base-content truncate">
                                        {firstName} {lastName}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">{gender}</span>
                                        {age && <span className="opacity-20 text-[10px]">•</span>}
                                        {age && <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">{age} Years</span>}
                                    </div>
                                    <p className="text-sm line-clamp-2 opacity-60 leading-relaxed italic mb-3">
                                        "{about || "A developer waiting to introduce themselves..."}"
                                    </p>
                                    {/* Skills for request cards */}
                                    {skills && skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="badge badge-secondary badge-outline badge-sm text-[8px] font-black uppercase tracking-tighter py-2 border-secondary/30">{skill}</span>
                                            ))}
                                            {skills.length > 3 && <span className="text-[10px] opacity-30 font-black">+{skills.length - 3}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='flex gap-3 w-full md:w-auto shrink-0'>
                                {activeTab === 'received' ? (
                                    <>
                                        <button
                                            className='btn btn-ghost hover:bg-error/10 hover:text-error rounded-2xl flex-1 md:flex-none h-14 px-8 font-black uppercase text-xs tracking-widest transition-colors'
                                            onClick={() => handleReview("rejected", request._id)}
                                        >
                                            Ignore
                                        </button>

                                        <button
                                            className='btn btn-secondary shadow-lg shadow-secondary/20 hover:shadow-secondary/40 rounded-2xl flex-1 md:flex-none h-14 px-8 font-black uppercase text-xs tracking-widest hover:-translate-y-1 active:scale-95 transition-all'
                                            onClick={() => handleReview("accepted", request._id)}
                                        >
                                            Accept
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className='btn btn-error btn-outline shadow-lg shadow-error/10 hover:shadow-error/30 rounded-2xl w-full md:w-48 h-14 px-8 font-black uppercase text-xs tracking-widest hover:-translate-y-1 active:scale-95 transition-all border-2'
                                        onClick={() => handleWithdraw(request._id)}
                                    >
                                        Unsend Request
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-6 mt-16 pb-10">
                <button 
                    disabled={currentPage === 1}
                    className="btn btn-circle btn-ghost border-2 border-base-content/10 disabled:opacity-20 hover:border-secondary transition-all"
                    onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    ❮
                </button>
                
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Page</span>
                    <span className="text-xl font-black text-secondary">{currentPage}</span>
                </div>

                <button 
                    disabled={currentRequests.length < limit}
                    className="btn btn-circle btn-ghost border-2 border-base-content/10 disabled:opacity-20 hover:border-secondary transition-all"
                    onClick={() => {
                        setCurrentPage(p => p + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    ❯
                </button>
            </div>
        </div>
    )
}

export default Requests;