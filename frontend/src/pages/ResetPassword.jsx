import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: "Passwords do not match." });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post(`${BASE_URL}/reset-password`, { token, newPassword });
            setStatus({ type: 'success', message: 'Password updated successfully! Transitioning to login...' });
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to reset password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-base-100">
            <div className="card w-full max-w-md bg-base-300 shadow-2xl border border-base-200 overflow-hidden">
                <div className="card-body p-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group transition-transform duration-500 hover:scale-110">
                        🛡️
                    </div>
                    <h2 className="card-title text-4xl font-black uppercase tracking-tighter mb-4">Reset Entry</h2>
                    <p className="text-sm opacity-60 mb-10 font-medium leading-relaxed">
                        Security override successful. Please enter your new high-strength credentials to secure your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label text-[10px] font-black uppercase tracking-widest opacity-40">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-100/50 border-base-200 text-base font-medium transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="label text-[10px] font-black uppercase tracking-widest opacity-40">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-100/50 border-base-200 text-base font-medium transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {status.message && (
                            <div className={`text-sm p-4 rounded-xl border font-bold animate-fadeIn ${status.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className={`btn btn-primary w-full rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 ${loading && 'loading'}`}
                        >
                            {loading ? 'Securing...' : 'Establish Password'}
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <Link to="/login" className="text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-primary transition-all">
                            Cancel Override
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
