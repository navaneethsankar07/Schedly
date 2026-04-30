import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, LogOut, Palette } from 'lucide-react';
import { themeChange } from 'theme-change';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        themeChange(false);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-primary">Scheduler</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`${isActive('/dashboard')
                                        ? 'border-primary text-base-content'
                                        : 'border-transparent text-base-content/60 hover:border-base-300 hover:text-base-content'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </Link>
                            <Link
                                to="/calendar"
                                className={`${isActive('/calendar')
                                        ? 'border-primary text-base-content'
                                        : 'border-transparent text-base-content/60 hover:border-base-300 hover:text-base-content'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
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
                                <li><button data-set-theme="nord" className="btn btn-sm btn-block btn-ghost justify-start">Nord</button></li>
                            </ul>
                        </div>

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
