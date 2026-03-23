import React, { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from "../utils/constant"
import { useForm } from "react-hook-form"

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLogin, setIsLogin] = useState(!location.state?.signup);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            emailId: "",
            password: "",
            firstName: "",
            lastName: ""
        }
    });

    const successMessage = location.state?.message;

    const onSubmit = async (formData) => {
        setLoading(true);
        setError("");
        const endpoint = isLogin ? "/login" : "/signup";

        try {
            const res = await axios.post(BASE_URL + endpoint, formData, { withCredentials: true });

            if (isLogin) {
                dispatch(addUser(res.data));
                navigate("/feed");
            } else {
                navigate("/verify-otp", { state: { emailId: formData.emailId } });
            }
        } catch (err) {
            if (err?.response?.status === 403) {
                navigate("/verify-otp", { state: { emailId: formData.emailId } });
            } else {
                setError(err?.response?.data?.message || err?.response?.data || "Operation failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        reset(); // Clears all RHF states
    };

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
                            type="button"
                            className={`flex-1 py-3 transition-all duration-300 ${isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                            onClick={() => !isLogin && toggleMode()}
                        >
                            LOGIN
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 transition-all duration-300 ${!isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                            onClick={() => isLogin && toggleMode()}
                        >
                            SIGN UP
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {!isLogin && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="label text-xs uppercase font-bold tracking-widest opacity-60">First Name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        className={`input input-bordered w-full focus:input-primary ${errors.firstName && "input-error"}`}
                                        placeholder="John"
                                        {...register("firstName", { required: !isLogin && "First name is required" })}
                                    />
                                    {errors.firstName && <span className="text-[10px] text-error mt-1 font-bold">{errors.firstName.message}</span>}
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="label text-xs uppercase font-bold tracking-widest opacity-60">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        className={`input input-bordered w-full focus:input-primary ${errors.lastName && "input-error"}`}
                                        placeholder="Doe"
                                        {...register("lastName", { required: !isLogin && "Last name is required" })}
                                    />
                                    {errors.lastName && <span className="text-[10px] text-error mt-1 font-bold">{errors.lastName.message}</span>}
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="emailId" className="label text-xs uppercase font-bold tracking-widest opacity-60">Email Address</label>
                            <input
                                id="emailId"
                                type="email"
                                className={`input input-bordered w-full focus:input-primary ${errors.emailId && "input-error"}`}
                                placeholder="developer@example.com"
                                {...register("emailId", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.emailId && <span className="text-[10px] text-error mt-1 font-bold">{errors.emailId.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="password" className="label text-xs uppercase font-bold tracking-widest opacity-60">Password</label>
                            <input
                                id="password"
                                type="password"
                                className={`input input-bordered w-full focus:input-primary ${errors.password && "input-error"}`}
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Minimum 8 characters" }
                                })}
                            />
                            {errors.password && <span className="text-[10px] text-error mt-1 font-bold">{errors.password.message}</span>}
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

                        {successMessage && !error && (
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
                                type="submit"
                                className="btn btn-primary w-full text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 h-14"
                                disabled={loading}
                            >
                                {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                                {loading ? (isLogin ? "Authenticating..." : "Creating Profile...") : (isLogin ? "Unlock Your Dashboard" : "Join the Community")}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className='text-sm opacity-60'>
                            {isLogin ? "New here?" : "Already a member?"}
                            <button
                                type="button"
                                className="ml-2 text-primary font-bold hover:underline"
                                onClick={toggleMode}
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