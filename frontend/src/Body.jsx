import React, { useEffect } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useGetProfileQuery } from './utils/apiSlice'
import { connectSocket, disconnectSocket } from './utils/socket'
import NotificationListener from './features/notifications/NotificationListener'
import { VideoCallProvider } from './features/chat/context/VideoCallContext'
import VideoCallPortal from './features/chat/VideoCallPortal'

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((store) => store.user);

    const { data: profile, error, isLoading } = useGetProfileQuery();

    useEffect(() => {
        if (profile) {
            dispatch(addUser(profile));
            if (location.pathname === "/") {
                navigate("/feed");
            }
        }
    }, [profile, dispatch, location.pathname, navigate]);

    useEffect(() => {
        const publicPaths = ["/login", "/", "/verify-otp", "/forgot-password", "/reset-password"];
        if (error?.status === 401 && !publicPaths.includes(location.pathname)) {
            navigate("/login");
            disconnectSocket();
        }
    }, [error, location.pathname, navigate]);

    // Socket lifecycle
    useEffect(() => {
        if (userData) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [userData]);

    const showFooter = ["/", "/login", "/verify-otp", "/forgot-password", "/reset-password"].includes(location.pathname);

    // Inner content wrapped conditionally with VideoCallProvider
    const content = (
        <>
            <Navbar />
            <NotificationListener />
            <main className="flex-1">
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </>
    );

    return (
        <div className="flex flex-col min-h-screen">
            {userData ? (
                <VideoCallProvider>
                    <VideoCallPortal />
                    {content}
                </VideoCallProvider>
            ) : (
                content
            )}
        </div>
    )
}

export default Body