import React, { useEffect, useState } from 'react'
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useSelector } from 'react-redux';

const Premium = () => {
    const [isPremium, setIsPremium] = useState(false);

    const user = useSelector((store) => store.user);

    useEffect(() => {
        if (user)
            setIsPremium(user?.isPremium);
    }, [user])


    const handlePurchase = async (type) => {
        try {
            const order = await axios.post(BASE_URL + "/payment/create", {
                membershipType: type,
            }, {
                withCredentials: true,
            })

            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: 'Dev Match',
                description: 'Connect with Developers',
                order_id: orderId,
                // callback_url: 'http://localhost:5173/payment-success', // Your success URL
                prefill: {
                    name: notes.firstName + " " + notes.lastName,
                    email: notes.emailId,
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            BASE_URL + "/payment/verify",
                            response,
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            setIsPremium(true);
                            alert("✅ Payment successful and verified!");
                        } else {
                            alert("⚠️ Payment verification failed!");
                        }
                    } catch (err) {
                        console.error("Payment verify error:", err);
                        alert("❌ Error verifying payment!");
                    }
                },

                // Handle failure
                modal: {
                    ondismiss: function () {
                        alert("Payment cancelled or closed by user.");
                    },
                },
            };


            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Error Initiating Payment!");
        }
    }

    return isPremium ? (<div className='text-3xl text-center'>You are already a Premium User</div>) : (
        <div className='container mx-auto my-10'>
            <div className="flex w-full  flex-col lg:flex-row">
                <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center">
                    <p className='text-2xl'>Silver Plan</p>
                    <button onClick={() => handlePurchase("silver")} className='btn btn-primary'>Get silver</button>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center">
                    <p className='text-2xl'>Gold Plan</p>
                    <button onClick={() => handlePurchase("gold")} className='btn btn-secondary'>Get gold</button>
                </div>
            </div>
        </div>
    )
}

export default Premium