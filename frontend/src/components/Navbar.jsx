import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, LogOut, Palette, User } from 'lucide-react';
import { themeChange } from 'theme-change';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        themeChange(false);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 dark:bg-base-100/80 backdrop-blur-xl border-b border-base-300/60 shadow-sm shadow-indigo-100/20 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-200">
                                <span className="text-white font-extrabold text-sm">S</span>
                            </div>
                            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Scheduler</span>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-2">
                            <Link
                                to="/dashboard"
                                className={`${isActive('/dashboard')
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'
                                    } inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                to="/calendar"
                                className={`${isActive('/calendar')
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'
                                    } inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200`}
                            >
                                <Calendar className="w-4 h-4" />
                                Calendar
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <Palette className="w-5 h-5 opacity-70" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 mt-4 space-y-1">
                                <li><button data-set-theme="light" className="btn btn-sm btn-block btn-ghost justify-start">Light</button></li>
                                <li><button data-set-theme="dark" className="btn btn-sm btn-block btn-ghost justify-start">Dark</button></li>
                                <li><button data-set-theme="cupcake" className="btn btn-sm btn-block btn-ghost justify-start">Cupcake</button></li>
                                <li><button data-set-theme="synthwave" className="btn btn-sm btn-block btn-ghost justify-start">Synthwave</button></li>
                                <li><button data-set-theme="dracula" className="btn btn-sm btn-block btn-ghost justify-start">Dracula</button></li>
                                <li><button data-set-theme="luxury" className="btn btn-sm btn-block btn-ghost justify-start">Luxury</button></li>
                            </ul>
                        </div>

                        <NotificationBell />

                        <Link
                            to="/profile"
                            className="btn btn-ghost btn-circle"
                            title="Profile"
                        >
                            <User className="w-5 h-5 opacity-70" />
                        </Link>

                        <button
                            onClick={logout}
                            className="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content transition"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
