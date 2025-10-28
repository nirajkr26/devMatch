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
    const [age, setAge] = useState(user.age);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [about, setAbout] = useState(user.about);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const saveProfile = async () => {
        setError(null);
        try {
            const res = await axios.patch(BASE_URL + "/profile/edit", { firstName, lastName, age, photoUrl, about }, {
                withCredentials: true,
            })
            dispatch(addUser(res?.data?.data))
            
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
        } catch (err) {
            setError(err?.response?.data || "something went wrong")
        }
    }

    return (
        <>
            <div className='flex justify-evenly my-6'>
                <div className='flex justify-center'>

                    <fieldset className=" fieldset bg-base-300 items-center  border-base-300 rounded-box w-xs border p-4">
                        <legend className=" text-2xl text-center">Profile</legend>

                        <label className="label">First Name</label>
                        <input type="text" className="input" placeholder="Enter your first name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />

                        <label className="label">Last Name</label>
                        <input type="text" className="input" placeholder="Enter your last name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />

                        <label className="label">Age</label>
                        <input type="number" min="18" max="60" className="input" placeholder="Enter age" value={age} onChange={(e) => { setAge(e.target.value) }} />

                        <label className="label">Photo URL</label>
                        <input type="url" className="input" placeholder="Enter image link" value={photoUrl} onChange={(e) => { setPhotoUrl(e.target.value) }} />

                        <label className="label">About</label>
                        <input type="text" className="input" placeholder="Enter about yourself" value={about} onChange={(e) => { setAbout(e.target.value) }} />


                        <p className='text-red-500 text-center'>{error}</p>
                        <button onClick={saveProfile} className="btn btn-neutral mt-4" >Save Profile</button>
                    </fieldset>
                </div>
                <Card user={{ firstName, lastName, age, about, gender: user.gender, photoUrl }} />
            </div>
            <div className="toast toast-top toast-center">

                {showToast && <div className="alert alert-success">
                    <span>Profile updated successfully.</span>
                </div>}
            </div>
        </>
    )
}

export default EditProfile