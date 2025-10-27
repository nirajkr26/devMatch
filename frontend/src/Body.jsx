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
        } catch (err) {
            if (err.status == 401) {
                navigate("/login");
            }
            console.error(err);
        }
    }

    useEffect(() => {
        if (!userData){
            fetchUser();
        }
    }, []);

    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Body