import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch } from 'react-redux'
import { removeUserFromFeed } from '../utils/feedSlice'


const Card = ({ user }) => {
    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        try {
            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {
                withCredentials: true
            })
            dispatch(removeUserFromFeed(userId))

        } catch (error) {
            console.error(error.data)
        }
    }

    return (
        <div className="card bg-base-300 w-84 h-120 shadow-sm">
            <figure className="">
                <img
                    src={user?.photoUrl} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>
                <p>{user.age + ", " + user.gender}</p>
                <p>{user.about}</p>
                <div className="card-actions justify-around my-4">
                    <button className="btn bg-red-500  
                    text-2xl text-white" onClick={() => handleSendRequest("ignored", user._id)}>Ignore</button>

                    <button className="btn bg-green-600 text-2xl text-white" onClick={() => handleSendRequest("interested", user._id)}>Interested</button>
                </div>
            </div>
        </div>
    )
}

export default Card