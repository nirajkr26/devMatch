import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { removeUser } from "../utils/userSlice";


const Navbar = () => {

    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, {
                withCredentials: true,
            })
            dispatch(removeUser());
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <div className="navbar bg-base-300 shadow-sm">
                <div className="flex-1">
                    <Link to={"/"} className="btn btn-ghost text-xl">devMatch</Link>
                </div>
                {user && (<div className="flex gap-2 items-center">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                    <p>Hey! {user?.firstName[0].toUpperCase() + user?.firstName.substr(1)}</p>
                    <div className="dropdown dropdown-end mx-5">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="profile pic"
                                    src={user?.photoUrl} />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to={"/profile"} className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link to={"/connections"}>Connections</Link></li>
                            <li><Link to={"/login"} onClick={handleLogout}>Logout</Link></li>
                        </ul>
                    </div>
                </div>)}
            </div>
        </>
    )
}

export default Navbar;