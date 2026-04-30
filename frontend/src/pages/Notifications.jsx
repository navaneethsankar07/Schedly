import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('notifications/');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markRead = async (id) => {
        try {
            await api.patch(`notifications/${id}/mark-read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) { console.error(err); }
    };

    const markAllRead = async () => {
        try {
            await api.post('notifications/mark-all-read/');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) { console.error(err); }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) return <div className="p-8 text-center text-base-content/50">Loading notifications...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                        <Bell className="w-6 h-6 text-primary" />
                        Notifications
                    </h1>
                    <p className="text-sm text-base-content/50 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="btn btn-ghost btn-sm gap-2 hover:text-primary">
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                    </button>
                )}
            </div>

            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden divide-y divide-base-200">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-base-content/30 gap-3">
                        <Bell className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-medium">No notifications yet</p>
                        <p className="text-xs">We'll notify you before your posts are due</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`flex items-start gap-4 p-4 transition-colors ${!n.is_read ? 'bg-primary/5' : 'hover:bg-base-200/40'}`}>
                            <div className="mt-0.5 flex-shrink-0">
                                {n.message.toLowerCase().includes('action required') ? (
                                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-relaxed ${!n.is_read ? 'font-semibold text-base-content' : 'text-base-content/60'}`}>
                                    {n.message}
                                </p>
                                <p className="text-xs text-base-content/40 mt-1">
                                    {format(new Date(n.created_at), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                            </div>
                            {!n.is_read ? (
                                <button
                                    onClick={() => markRead(n.id)}
                                    className="flex-shrink-0 btn btn-ghost btn-sm gap-1 text-primary/70 hover:text-primary"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Read
                                </button>
                            ) : (
                                <CheckCircle2 className="w-4 h-4 text-base-content/20 flex-shrink-0 mt-1" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
