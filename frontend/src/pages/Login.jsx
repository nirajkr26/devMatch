import React, { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/constant"

const Login = () => {
    const [emailId, setEmail] = useState("test111@gmail.com");
    const [password, setPassword] = useState("Test@123");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(BASE_URL + "/login", {
                emailId,
                password
            }, { withCredentials: true })

            dispatch(addUser(res.data));
            navigate("/")
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className='flex justify-center'>

            <fieldset className="my-5 fieldset bg-base-300 items-center  border-base-300 rounded-box w-xs border p-4">
                <legend className=" text-2xl text-center">Login</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" value={emailId} onChange={(e) => { setEmail(e.target.value) }} />

                <label className="label">Password</label>
                <input type="text" className="input" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

                <button className="btn btn-neutral mt-4" onClick={handleLogin}>Login</button>
            </fieldset>
        </div>
    )
}

export default Login