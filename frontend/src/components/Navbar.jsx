import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, LogOut, Palette, User, Menu, X, Columns2, BarChart2 } from 'lucide-react';
import { themeChange } from 'theme-change';
import NotificationBell from './NotificationBell';
import LogoutModal from './LogoutModal';
import SchedlyLogo from './SchedlyLogo';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        themeChange(false);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    const navLinks = [
        { to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
        { to: '/calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
        { to: '/workflow', icon: <Columns2 className="w-4 h-4" />, label: 'Workflow' },
        { to: '/reports', icon: <BarChart2 className="w-4 h-4" />, label: 'Reports' },
    ];

    return (
        <>
            <nav className="bg-c-card/80 backdrop-blur-xl border-b border-c-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left: Logo + Desktop Nav Links */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex-shrink-0 flex items-center text-c-text">
                                <SchedlyLogo size="md" showText={true} />
                            </Link>
                            <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-2">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`${isActive(link.to)
                                            ? 'bg-c-accent/10 text-c-accent font-semibold shadow-sm'
                                            : 'text-c-muted hover:text-c-text hover:bg-c-bg'
                                            } inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Theme picker */}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-sm bg-c-card border border-c-border rounded-box w-36 mt-4 space-y-1">
                                    <li><button data-set-theme="light" className="btn btn-sm btn-block btn-ghost justify-start text-c-text">Light</button></li>
                                    <li><button data-set-theme="dark" className="btn btn-sm btn-block btn-ghost justify-start text-c-text">Dark</button></li>
                                </ul>
                            </div>

                            <NotificationBell />

                            {/* Profile — hidden on very small, shown sm+ */}
                            <Link to="/profile" className="hidden sm:flex btn btn-ghost btn-circle btn-sm sm:btn-md" title="Profile">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                            </Link>

                            {/* Logout — hidden on mobile */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="hidden sm:flex btn btn-ghost btn-sm text-c-muted hover:text-c-text transition gap-1.5"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Logout</span>
                            </button>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="sm:hidden btn btn-ghost btn-circle btn-sm"
                                aria-label="Toggle mobile menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-c-border bg-c-card/95 backdrop-blur-md">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`${isActive(link.to)
                                        ? 'bg-c-accent/10 text-c-accent font-semibold'
                                        : 'text-c-muted hover:text-c-text hover:bg-c-bg'
                                        } flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                className={`${isActive('/profile')
                                    ? 'bg-c-accent/10 text-c-accent font-semibold'
                                    : 'text-c-muted hover:text-c-text hover:bg-c-bg'
                                    } flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all`}
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <button
                                onClick={() => { setMobileMenuOpen(false); setShowLogoutModal(true); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default Navbar;
