import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

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

    const navLinks = [
        { name: 'Feed', path: '/feed' },
        { name: 'Connections', path: '/connections' },
        { name: 'Requests', path: '/requests' },
    ];

    return (
        <div className="navbar bg-base-300/80 backdrop-blur-md sticky top-0 z-[100] px-4 md:px-8 border-b border-base-200/50 h-20 transition-all duration-300">
            {/* Left Section: Logo */}
            <div className="flex-1">
                <Link to={user ? "/feed" : "/"} className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white font-black text-xl italic">dm</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-base-content hidden sm:block">
                        devMatch
                    </span>
                </Link>
            </div>

            {/* Center Section: Navigation Links (Desktop Only) */}
            {user && (
                <div className="hidden lg:flex items-center gap-2 bg-base-100 rounded-2xl p-1.5 border border-base-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "hover:bg-base-200 opacity-60 hover:opacity-100"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Right Section: Actions */}
            <div className="flex-none flex items-center gap-3 ml-4">
                {/* Theme Toggle */}
                <button
                    onClick={handleThemeToggle}
                    className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary transition-colors"
                >
                    {theme === "dark" ? (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                    ) : (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" /></svg>
                    )}
                </button>

                {user ? (
                    <div className="flex items-center gap-1">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none mb-1">Developer</span>
                            <span className="text-sm font-black text-base-content leading-none">
                                {user.firstName}
                            </span>
                        </div>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0.5 ring-2 ring-transparent hover:ring-primary transition-all duration-300">
                                <div className="w-10 rounded-xl overflow-hidden shadow-lg border-2 border-base-100">
                                    <img alt="profile" src={user?.photoUrl || "/default-avatar.png"} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[101] p-3 shadow-2xl bg-base-300 rounded-[1.5rem] w-60 border border-base-200">
                                <div className="px-4 py-3 border-b border-base-200 mb-2">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Signed in as</p>
                                    <p className="text-sm font-black truncate">{user.firstName} {user.lastName}</p>
                                </div>
                                <li className="lg:hidden"><Link to="/feed" className="py-3 font-bold">Feed</Link></li>
                                <li className="lg:hidden"><Link to="/connections" className="py-3 font-bold">Connections</Link></li>
                                <li className="lg:hidden"><Link to="/requests" className="py-3 font-bold">Requests</Link></li>
                                <li><Link to="/profile" className="py-3 font-bold">Account Settings</Link></li>
                                <li><Link to="/premium" className="py-3 font-bold text-primary italic">Upgrade to Gold</Link></li>
                                <div className="divider my-1 opacity-50"></div>
                                <li><Link to="/login" onClick={handleLogout} className="py-3 font-bold text-error hover:bg-error/10">Sign Out</Link></li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-primary btn-sm md:btn-md rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-primary/20">Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;