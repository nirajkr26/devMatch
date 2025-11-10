import React, { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/constant"

const Login = () => {
    const [emailId, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
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
            setError(err?.response?.data || "Something went wrong");
        }
    }

    const handleSignUp = async () => {
        try {
            const res = await axios.post(BASE_URL + "/signup", {
                firstName,
                lastName,
                emailId,
                password
            }, { withCredentials: true })

            dispatch(addUser(res.data));
            navigate("/profile")
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    }

    return (
        <div className='flex justify-center'>

            <fieldset className="my-5 fieldset bg-base-300 items-center  border-base-300 rounded-box w-xs border p-4">
                <legend className=" text-2xl text-center">{isLogin ? "Login" : "Sign Up"}</legend>

                {!isLogin && <><label className="label">First Name</label>
                    <input type="text" className="input" placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />

                    <label className="label">Last Name</label>
                    <input type="text" className="input" placeholder="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} /></>
                }
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" value={emailId} onChange={(e) => { setEmail(e.target.value) }} />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <p className='text-red-500 text-center'>{error}</p>
                <button className="btn btn-neutral mt-4" onClick={isLogin ? handleLogin : handleSignUp}>{isLogin ? "Login" : "Sign Up"}</button>

                <p className='text-blue-500 cursor-pointer  text-center' onClick={() => setIsLogin(!isLogin)}>{isLogin ? "New User? Sign Up Here" : "Existing User? Login Here"}</p>
            </fieldset>
        </div>
    )
}

export default Login