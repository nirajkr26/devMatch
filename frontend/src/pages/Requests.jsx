import React from 'react'
import { useGetRequestsQuery, useReviewConnectionRequestMutation } from '../utils/apiSlice'
import { Link } from 'react-router-dom'

const Requests = () => {
    const { data, isLoading } = useGetRequestsQuery();
    const [reviewConnectionRequest] = useReviewConnectionRequestMutation();
    const requests = data?.data;

    const handleReview = async (status, requestId) => {
        try {
            await reviewConnectionRequest({ status, requestId }).unwrap();
        } catch (err) {
            console.error(err.response?.data || err.message)
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-base-300 w-full h-32 rounded-[2rem] animate-pulse border border-base-200"></div>
                ))}
            </div>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-8 shadow-xl border border-base-200">
                    <span className="text-5xl" role="img" aria-label="Inbox icon">📥</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content mb-4 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">Inbox Clean!</h2>
                <p className="opacity-60 max-w-sm mx-auto text-lg leading-relaxed">No pending connection requests at the moment. You're all caught up!</p>
                <Link to="/feed" className="btn btn-primary btn-outline btn-lg mt-10 rounded-full px-12 border-2 hover:scale-105 transition-all">Explore Developers</Link>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto my-10 px-4 sm:px-10 pb-20'>
            {/* Page Header */}
            <div className='mb-12 text-center lg:text-left'>
                <h1 className='text-4xl md:text-5xl font-black tracking-tighter text-base-content uppercase'>Incoming Requests</h1>
                <div className="h-1.5 w-24 bg-secondary rounded-full mt-3 mx-auto lg:mx-0"></div>
                <p className="text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">{requests.length} Potential Collaborators</p>
            </div>

            <div className='space-y-6'>
                {requests.map((request) => {
                    const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = request.fromUserId;

                    return (
                        <div
                            key={_id}
                            className="group bg-base-300 rounded-[2.5rem] p-6 shadow-xl hover:shadow-secondary/5 transition-all duration-300 border border-base-200 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-5 w-full overflow-hidden">
                                <div className="shrink-0 relative">
                                    <img
                                        alt="profile"
                                        className="rounded-3xl w-20 h-20 md:w-24 md:h-24 object-cover ring-2 ring-base-200 group-hover:ring-secondary/40 transition-all duration-500"
                                        src={photoUrl || "/default-avatar.png"}
                                    />
                                    <div className="absolute -top-1 -right-1 badge badge-secondary badge-xs p-1.5 border-4 border-base-300 shadow-lg"></div>
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
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Requests;