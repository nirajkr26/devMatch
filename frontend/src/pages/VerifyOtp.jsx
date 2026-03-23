import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from signup state
    const emailId = location.state?.emailId;

    useEffect(() => {
        if (!emailId) {
            navigate('/login');
        }
    }, [emailId, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                `${BASE_URL}/verify-otp`,
                { emailId, otp: otpValue },
                { withCredentials: true }
            );
            // On success, backend sends the user object
            // Use dispatch if you want to log them in immediately
            // dispatch(addUser(res.data.user));
            navigate('/login', { state: { message: 'Account verified! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await axios.post(`${BASE_URL}/resend-otp`, { emailId });
            setError('New OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-base-100">
            <div className="card w-full max-w-md bg-base-300 shadow-2xl border border-base-200">
                <div className="card-body items-center text-center p-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
                        📩
                    </div>
                    <h2 className="card-title text-3xl font-black uppercase tracking-tighter mb-2">Verify Email</h2>
                    <p className="text-sm opacity-60 mb-8 font-medium">
                        Enter the 6-digit code sent to <br />
                        <span className="text-primary font-bold">{emailId}</span>
                    </p>

                    <div className="flex gap-2 mb-8">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-14 text-center text-2xl font-black bg-base-100 border-2 border-base-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className={`text-sm mb-6 ${error.includes('sent') ? 'text-success' : 'text-error'} font-bold animate-fadeIn`}>
                            {error}
                        </div>
                    )}

                    <button
                        className="btn btn-primary w-full rounded-2xl h-14 text-lg shadow-xl shadow-primary/20"
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                        {loading ? 'Verifying...' : 'Verify Engine'}
                    </button>


                    <p className="mt-8 text-sm opacity-60 font-medium">
                        Didn't receive code?{' '}
                        <button
                            className={`text-primary font-black hover:underline ${resending && 'opacity-50 pointer-events-none'}`}
                            onClick={handleResend}
                        >
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
