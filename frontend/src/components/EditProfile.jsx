import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import axios from "axios";
import { BASE_URL } from '../utils/constant';
import { addUser } from '../utils/userSlice';

const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age || "");
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [about, setAbout] = useState(user.about);
    const [gender, setGender] = useState(user.gender || "male");
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const dispatch = useDispatch();

    const saveProfile = async () => {
        setError(null);
        try {
            const res = await axios.patch(BASE_URL + "/profile/edit", {
                firstName, lastName, age, photoUrl, about, gender
            }, {
                withCredentials: true,
            })
            dispatch(addUser(res?.data?.data))

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
        } catch (err) {
            setError(err?.response?.data || "Something went wrong while saving.")
        }
    }

    const ProfilePreview = () => (
        <div className='w-full flex flex-col items-center gap-6 md:gap-10 my-8 lg:my-0 lg:sticky lg:top-10'>
            <div className="flex items-center gap-3 opacity-30">
                <span className="h-px w-8 bg-current"></span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Live Feed View</span>
                <span className="h-px w-8 bg-current"></span>
            </div>
            <div className="scale-[0.85] sm:scale-95 md:scale-100 origin-top hover:scale-[1.03] transition-all duration-500 w-full flex justify-center">
                <Card user={{ firstName, lastName, age, about, gender, photoUrl }} isPreview={true} />
            </div>
        </div>
    );

    return (
        <div className="pb-20 animate-fadeIn overflow-x-hidden">
            <div className='flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 lg:gap-20 my-6 md:my-10 max-w-7xl mx-auto px-4 sm:px-10 leading-relaxed'>

                {/* Form Section */}
                <div className='w-full lg:w-3/5 max-w-2xl'>
                    <div className="bg-base-300 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-base-200">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-base-content uppercase">Edit Profile</h2>
                            <div className="h-1.5 w-20 bg-primary rounded-full mt-2 mx-auto lg:mx-0"></div>
                            <p className="text-xs md:text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">Personal Dashboard</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="form-control w-full">
                                <label className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">First Name</span>
                                </label>
                                <input type="text" className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Last Name</span>
                                </label>
                                <input type="text" className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Age</span>
                                </label>
                                <input type="number" min="18" max="99" className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Gender</span>
                                </label>
                                <select className="select select-bordered w-full h-14 rounded-2xl focus:select-primary bg-base-200/50 border-base-200 text-base font-medium transition-all" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Only: Insert Preview here */}
                        <div className="lg:hidden">
                            <ProfilePreview />
                        </div>

                        <div className="form-control w-full mt-6">
                            <label className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Photo URL</span>
                            </label>
                            <input type="url" className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all" placeholder="https://example.com/avatar.jpg" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                        </div>

                        <div className="form-control w-full mt-6">
                            <label className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">About Your Journey</span>
                            </label>
                            <textarea className="textarea textarea-bordered w-full h-40 rounded-3xl focus:textarea-primary bg-base-200/50 border-base-200 text-base font-medium transition-all p-5" placeholder="Tell other developers about your stacks, goals, and what you're building..." value={about} onChange={(e) => setAbout(e.target.value)} />
                        </div>

                        {error && (
                            <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button onClick={saveProfile} className="btn btn-primary btn-lg w-full h-16 mt-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all text-sm font-black uppercase tracking-[0.2em]">
                            Push Update
                        </button>
                    </div>
                </div>

                {/* Desktop/Tablet Only: Render Preview on side */}
                <div className="hidden lg:block lg:w-2/5">
                    <ProfilePreview />
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="toast toast-top toast-center z-[100]">
                    <div className="alert alert-success shadow-2xl border-none text-white font-extrabold py-5 px-10 rounded-[2rem] animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="tracking-tight">Profile has been updated!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProfile