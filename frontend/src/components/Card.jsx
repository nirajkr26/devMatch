import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../utils/constant'
import { removeUserFromFeed } from '../utils/feedSlice'
import { useDispatch } from 'react-redux'

const Card = ({ user, isPreview = false }) => {
    const dispatch = useDispatch();

    if (!user) return null;

    const handleSendRequest = async (status, userId) => {
        if (isPreview) return; // Guard clause
        try {
            await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {
                withCredentials: true
            })
            dispatch(removeUserFromFeed(userId))
        } catch (error) {
            console.error(error.response?.data || error.message)
        }
    }

    return (
        <div className="card bg-base-300 w-full max-w-[380px] h-[600px] shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-base-200 overflow-hidden group">
            {/* Image Section */}
            <figure className="relative h-2/3 overflow-hidden">
                <img
                    src={user?.photoUrl || "/default-avatar.png"}
                    alt={`${user?.firstName}'s profile`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay for Text Clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent opacity-60"></div>

                {/* Floating Badge (Optional) */}
                {user?.gender && (
                    <div className="absolute top-4 right-4 badge badge-primary font-bold shadow-lg py-3 px-4 uppercase text-[10px] tracking-widest">
                        {user.gender}
                    </div>
                )}
            </figure>

            {/* Content Section */}
            <div className="card-body p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-end gap-2 mb-1 flex-wrap">
                        <h2 className="card-title text-2xl font-black text-base-content">{user.firstName} {user.lastName}</h2>
                        <span className="text-xl opacity-50 font-medium pb-0.5">{user.age && `• ${user.age}`}</span>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-3 leading-relaxed mt-2 text-base-content/80">
                        {user.about || "This developer is keeping their bio a mystery... but they're ready to build!"}
                    </p>
                </div>

                {/* Actions */}
                <div className="card-actions grid grid-cols-2 gap-4 mt-6">
                    <button
                        className="btn btn-error btn-outline border-2 hover:bg-error hover:text-white transition-all duration-300 font-bold group/btn"
                        onClick={() => handleSendRequest("ignored", user._id)}
                    >
                        <span className="group-hover/btn:scale-110 transition-transform">Pass</span>
                    </button>

                    <button
                        className="btn btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-bold group/btn"
                        onClick={() => handleSendRequest("interested", user._id)}
                    >
                        <span className="group-hover/btn:scale-110 transition-transform">Connect</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card