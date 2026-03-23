import React, { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from "../utils/constant"

const Login = () => {
    const location = useLocation();
    const [emailId, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLogin, setIsLogin] = useState(!location.state?.signup);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const successMessage = location.state?.message;


    const handleLogin = async () => {
        if (!emailId || !password) {
            setError("Email and Password are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        try {
            const res = await axios.post(BASE_URL + "/login", {
                emailId,
                password
            }, { withCredentials: true })
            dispatch(addUser(res.data));
            navigate("/feed")
        } catch (err) {
            if (err?.response?.status === 403) {
                // If unverified, send them to verify page
                navigate("/verify-otp", { state: { emailId } });
            } else {
                setError(err?.response?.data?.message || err?.response?.data || "Invalid Credentials");
            }
        }
    }


    const handleSignUp = async () => {
        if (!firstName || !lastName || !emailId || !password) {
            setError("All fields are required for sign up");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        try {
            const res = await axios.post(BASE_URL + "/signup", {
                firstName,
                lastName,
                emailId,
                password
            }, { withCredentials: true })

            // Backend returns 200/201 but account is pending verification
            navigate("/verify-otp", { state: { emailId } });
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data || "Signup failed. Please try again.");
        }
    }


    return (
        <div className='flex items-center justify-center min-h-[80vh] px-4 py-10 bg-base-100'>
            <div className="card w-full max-w-md bg-base-300 shadow-2xl overflow-hidden border border-base-200">
                <div className="card-body p-8">
                    <div className='text-center mb-8'>
                        <h1 className="text-4xl font-extrabold text-primary mb-2">devMatch</h1>
                        <p className="text-sm opacity-70 italic">Discover your next co-builder</p>
                    </div>

                    <div className="flex border-b border-base-200 mb-6 font-semibold">
                        <button
                            className={`flex-1 py-3 transition-all duration-300 ${isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                            onClick={() => { setIsLogin(true); setError(""); }}
                        >
                            LOGIN
                        </button>
                        <button
                            className={`flex-1 py-3 transition-all duration-300 ${!isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                            onClick={() => { setIsLogin(false); setError(""); }}
                        >
                            SIGN UP
                        </button>
                    </div>

                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="label text-xs uppercase font-bold tracking-widest opacity-60">First Name</label>
                                    <input type="text" className="input input-bordered w-full focus:input-primary" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="label text-xs uppercase font-bold tracking-widest opacity-60">Last Name</label>
                                    <input type="text" className="input input-bordered w-full focus:input-primary" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="label text-xs uppercase font-bold tracking-widest opacity-60">Email Address</label>
                            <input type="email" className="input input-bordered w-full focus:input-primary" placeholder="developer@example.com" value={emailId} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <label className="label text-xs uppercase font-bold tracking-widest opacity-60">Password</label>
                            <input type="password" className="input input-bordered w-full focus:input-primary" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {isLogin && (
                                <div className="text-right mt-1">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mt-6 bg-success/10 text-success text-sm p-3 rounded-lg border border-success/20 text-center font-bold">
                            {successMessage}
                        </div>
                    )}


                    {error && (
                        <div className="mt-6 bg-error/10 text-error text-sm p-3 rounded-lg border border-error/20 text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="card-actions mt-10">
                        <button
                            className="btn btn-primary w-full text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300"
                            onClick={isLogin ? handleLogin : handleSignUp}
                        >
                            {isLogin ? "Unlock Your Dashboard" : "Join the Community"}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className='text-sm opacity-60'>
                            {isLogin ? "New here?" : "Already a member?"}
                            <button
                                className="ml-2 text-primary font-bold hover:underline"
                                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                            >
                                {isLogin ? "Create an account" : "Log in now"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login