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
        const endpoint = isLogin ? "login" : "signup";

        try {
            const res = await axios.post(`${BASE_URL}/${endpoint}`, formData, { withCredentials: true });

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

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-base-content/10"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-base-300 px-2 text-base-content/40 font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => window.location.href = `${BASE_URL}/auth/google`}
                            className="btn btn-outline border-base-content/10 hover:bg-base-content/5 flex items-center gap-2 font-bold text-xs uppercase tracking-widest h-12"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.href = `${BASE_URL}/auth/github`}
                            className="btn btn-outline border-base-content/10 hover:bg-base-content/5 flex items-center gap-2 font-bold text-xs uppercase tracking-widest h-12"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

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