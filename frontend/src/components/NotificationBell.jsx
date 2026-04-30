import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { format } from 'date-fns';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('notifications/');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30s for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markRead = async (id) => {
        try {
            await api.patch(`notifications/${id}/mark-read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('notifications/mark-all-read/');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-circle relative"
                title="Notifications"
            >
                <Bell className="w-5 h-5 opacity-70" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-[200] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-primary" />
                                <span className="font-bold text-base-content text-sm">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="badge badge-primary badge-sm">{unreadCount} new</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="btn btn-ghost btn-xs gap-1 text-base-content/60 hover:text-primary"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck className="w-3 h-3" />
                                        All read
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-xs btn-circle">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Notification list */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-base-content/40 gap-2">
                                    <Bell className="w-8 h-8 opacity-30" />
                                    <p className="text-sm">You're all caught up!</p>
                                </div>
                            ) : (
                                notifications.slice(0, 10).map(n => (
                                    <div
                                        key={n.id}
                                        className={`flex gap-3 px-4 py-3 transition-colors ${!n.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-base-200/50'}`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {n.message.toLowerCase().includes('action required') ? (
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!n.is_read ? 'text-base-content font-medium' : 'text-base-content/60'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-base-content/40 mt-1">
                                                {format(new Date(n.created_at), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                        {!n.is_read && (
                                            <button
                                                onClick={() => markRead(n.id)}
                                                className="flex-shrink-0 text-primary/50 hover:text-primary transition mt-0.5"
                                                title="Mark as read"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-base-200 px-4 py-2.5">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                View all notifications →
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
