import React, { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true })
            console.log(res?.data?.data)
            dispatch(addConnections(res?.data?.data));
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if (connections.length == 0) return <div className='text-3xl'>No connections found</div>

    return (
        <div className='text-center my-10'>
            <div className='text-3xl'>Connections</div>

            {connections.map((connection) => {
                const { _id, firstName, lastName, age, gender, about, photoUrl } = connection;

                return (
                    <div key={_id} className='m-4 p-4 w-[40vw] mx-auto rounded-lg  flex bg-base-300' >
                        <img alt='photo' className='rounded-full w-20 h-20' src={photoUrl} />
                        <div className='mx-2 text-left'>
                            <h2 className='font-bold text-xl'>{firstName + " " + lastName}</h2>
                            {age && gender && <p>{age + ", " + gender}</p>}
                            <p>{about}</p>
                        </div>
                        {console.log(photoUrl)}
                    </div>
                )
            })}

        </div>
    )
}

export default Connections