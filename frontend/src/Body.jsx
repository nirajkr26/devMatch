import React, { useEffect } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useGetProfileQuery } from './utils/apiSlice'

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((store) => store.user);

    // RTK Query hook handles everything including caching
    const { data: profile, error, isLoading } = useGetProfileQuery();

    useEffect(() => {
        if (profile) {
            dispatch(addUser(profile));
            // Redirect from landing to feed if already logged in
            if (location.pathname === "/") {
                navigate("/feed");
            }
        }
    }, [profile, dispatch, location.pathname, navigate]);

    useEffect(() => {
        // Handle unauthorized access to protected routes
        const publicPaths = ["/login", "/", "/verify-otp", "/forgot-password", "/reset-password"];
        if (error?.status === 401 && !publicPaths.includes(location.pathname)) {
            navigate("/login");
        }
    }, [error, location.pathname, navigate]);

    const showFooter = ["/", "/login"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </div>
    )
}

export default Body