import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const reviewRequest = async (status, _id) => {
        try {
            const req = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {
                withCredentials: true
            })
            dispatch(removeRequest(_id));
        } catch (err) {
            console.error(err.data)
        }
    }

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });

            dispatch(addRequests(res?.data?.data))
        } catch (error) {
            console.error(error.data)
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [])

    if (!requests) return;

    if (requests.length == 0) return <div className='text-3xl text-center'>No requests found</div>

    return (
        <div className='text-center my-10'>
            <div className='text-3xl'>Connection Requests</div>

            {requests.map((request) => {
                const { _id, firstName, lastName, age, gender, about, photoUrl } = request.fromUserId;

                return (
                    <div key={_id} className='m-4 p-4 w-2/3 mx-auto rounded-lg flex-col flex justify-between items-center bg-base-300 gap-6 md:w-1/2 sm:flex-row' >
                        <div className='flex'>

                            <img alt='photo' className='rounded-full w-20 h-20' src={photoUrl} />
                            <div className='mx-2 text-left'>
                                <h2 className='font-bold text-xl'>{firstName + " " + lastName}</h2>
                                {age && gender && <p>{age + ", " + gender}</p>}
                                <p>{about}</p>
                            </div>
                        </div>
                        <div className='flex gap-4 flex-row'>
                            <button className='btn btn-primary' onClick={() => reviewRequest("rejected", request._id)}>Reject</button>

                            <button className='btn btn-secondary' onClick={() => reviewRequest("accepted", request._id)}>Accept</button>
                        </div>
                    </div>

                )
            })}

        </div>
    )
}

export default Requests