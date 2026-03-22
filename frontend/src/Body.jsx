import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { BASE_URL } from './utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useEffect } from 'react'
import axios from 'axios'

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);

    const fetchUser = async () => {
        try {
            const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true })
            dispatch(addUser(res.data));
            if (window.location.pathname === "/") {
                navigate("/feed");
            }
        } catch (err) {
            if (err.status === 401 && window.location.pathname !== "/login" && window.location.pathname !== "/") {
                navigate("/login");
            }
            console.error(err);
        }
    }

    useEffect(() => {
        if (!userData) {
            fetchUser();
        }
    }, []);

    const showFooter = ["/", "/login"].includes(window.location.pathname);

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