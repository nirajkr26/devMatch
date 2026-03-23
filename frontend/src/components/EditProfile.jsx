import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import axios from "axios";
import { BASE_URL } from '../utils/constant';
import { addUser } from '../utils/userSlice';
import { CheckIcon } from '../utils/Icons';
import { useForm } from "react-hook-form";

const EditProfile = ({ user }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age || "",
            photoUrl: user.photoUrl,
            about: user.about,
            gender: user.gender || "male",
            skills: user.skills?.join(", ") || ""
        }
    });

    // Watch all fields for the live preview
    const watchedFields = watch();

    const onSubmit = async (data) => {
        setError(null);
        try {
            const { skills, ...rest } = data;
            // Process skills string back into an array
            const skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0);

            const res = await axios.patch(BASE_URL + "/profile/edit", {
                ...rest,
                skills: skillsArray
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
                <Card
                    user={{
                        ...watchedFields,
                        skills: watchedFields.skills ? watchedFields.skills.split(",").map(s => s.trim()).filter(s => s) : []
                    }}
                    isPreview={true}
                />
            </div>
        </div>
    );

    return (
        <div className="pb-20 animate-fadeIn overflow-x-hidden">
            <div className='flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 lg:gap-20 my-6 md:my-10 max-w-7xl mx-auto px-4 sm:px-10 leading-relaxed'>

                {/* Form Section */}
                <div className='w-full lg:w-3/5 max-w-2xl'>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-base-300 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-base-200">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-base-content uppercase">Edit Profile</h2>
                            <div className="h-1.5 w-20 bg-primary rounded-full mt-2 mx-auto lg:mx-0"></div>
                            <p className="text-xs md:text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">Personal Dashboard</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="form-control w-full">
                                <label htmlFor="firstName" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">First Name</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.firstName && "input-error"}`}
                                    placeholder="John"
                                    {...register("firstName", { required: "First name is required" })}
                                />
                                {errors.firstName && <span className="text-[10px] text-error mt-1 font-bold">{errors.firstName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="lastName" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Last Name</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.lastName && "input-error"}`}
                                    placeholder="Doe"
                                    {...register("lastName", { required: "Last name is required" })}
                                />
                                {errors.lastName && <span className="text-[10px] text-error mt-1 font-bold">{errors.lastName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="age" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Age</span>
                                </label>
                                <input
                                    id="age"
                                    type="number"
                                    min="18" max="99"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.age && "input-error"}`}
                                    placeholder="25"
                                    {...register("age", { required: "Age is required", min: 18, max: 99 })}
                                />
                                {errors.age && <span className="text-[10px] text-error mt-1 font-bold">{errors.age.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="gender" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Gender</span>
                                </label>
                                <select
                                    id="gender"
                                    className="select select-bordered w-full h-14 rounded-2xl focus:select-primary bg-base-200/50 border-base-200 text-base font-medium transition-all"
                                    {...register("gender")}
                                >
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
                            <label htmlFor="photoUrl" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Photo URL</span>
                            </label>
                            <input
                                id="photoUrl"
                                type="url"
                                className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.photoUrl && "input-error"}`}
                                placeholder="https://example.com/avatar.jpg"
                                {...register("photoUrl", { required: "Photo URL is required" })}
                            />
                            {errors.photoUrl && <span className="text-[10px] text-error mt-1 font-bold">{errors.photoUrl.message}</span>}
                        </div>

                        <div className="form-control w-full mt-6">
                            <label htmlFor="skills" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Technical Stacks / Skills</span>
                            </label>
                            <input
                                id="skills"
                                type="text"
                                className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all"
                                placeholder="React, Node.js, Python, AWS... (comma-separated)"
                                {...register("skills")}
                            />
                        </div>

                        <div className="form-control w-full mt-6">
                            <label htmlFor="about" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">About Your Journey</span>
                            </label>
                            <textarea
                                id="about"
                                className={`textarea textarea-bordered w-full h-40 rounded-3xl focus:textarea-primary bg-base-200/50 border-base-200 text-base font-medium transition-all p-5 ${errors.about && "textarea-error"}`}
                                placeholder="Tell other developers about your stacks, goals, and what you're building..."
                                {...register("about", { required: "About section is required" })}
                            />
                            {errors.about && <span className="text-[10px] text-error mt-1 font-bold">{errors.about.message}</span>}
                        </div>

                        {error && (
                            <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg w-full h-16 mt-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all text-sm font-black uppercase tracking-[0.2em]">
                            Push Update
                        </button>
                    </form>
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
                        <CheckIcon className="stroke-current shrink-0 h-6 w-6" />
                        <span className="tracking-tight">Profile has been updated!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProfile