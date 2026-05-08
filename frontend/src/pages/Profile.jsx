import React, { useState, useEffect, useContext } from 'react';
import { User, Activity, Edit2, Check, AlertTriangle, Key } from 'lucide-react';
import MascotOrb from "../components/MascotOrb";
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { logout } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ total: 0, posted: 0, scheduled: 0 });
    const [isEditingName, setIsEditingName] = useState(false);
    const [username, setUsername] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchStats();
        // eslint-disable-next-line
    }, []);

    async function fetchProfile() {
        try {
            const res = await api.get('user/profile/');
            setProfile(res.data);
            setUsername(res.data.username);
        } catch (err) {
            console.error(err);
        }
    };

    async function fetchStats() {
        try {
            const res = await api.get('posts/');
            const posts = res.data;
            const posted = posts.filter(p => p.status === 'posted').length;
            const scheduled = posts.length - posted;
            setStats({ total: posts.length, posted, scheduled });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateName = async () => {
        try {
            await api.put('user/profile/', { username });
            setIsEditingName(false);
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        try {
            await api.post('auth/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setPasswordSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Failed to change password.');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        try {
            await api.delete('auth/delete-account/');
            setShowDeleteModal(false);
            logout(); // clear tokens and redirect
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div className="p-8 text-center text-base-content/50">Loading profile...</div>;

    const isPasswordUser = profile.login_method === 'password';

    return (
        <div className="space-y-5 sm:space-y-8 max-w-4xl mx-auto relative z-10 pb-10 sm:pb-12">
            {/* Top Section - Profile Header */}
            <div className="bg-c-card rounded-2xl sm:rounded-3xl shadow-sm border border-c-border overflow-hidden relative">
                <div className="h-24 sm:h-32 w-full bg-c-bg border-b border-c-border relative overflow-hidden">
                    <div className="absolute inset-0 bg-c-accent/5 mix-blend-overlay"></div>
                </div>

                <div className="p-4 sm:p-8 pt-0 relative bg-c-card">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-10 sm:-mt-12 mb-5 sm:mb-8">
                        <div className="w-20 h-20 sm:w-32 sm:h-32 bg-c-card rounded-full flex items-center justify-center border-4 border-c-card shadow-sm overflow-hidden z-10 p-1 relative group flex-shrink-0">
                            <div className="w-full h-full bg-c-bg rounded-full flex items-center justify-center text-c-accent group-hover:scale-105 transition-transform duration-500">
                                <User className="w-10 h-10 sm:w-16 sm:h-16" />
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1 pb-1 sm:pb-2 min-w-0">
                            <h1 className="text-xl sm:text-3xl font-black text-c-text tracking-tight flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="input input-sm border-c-border bg-c-bg shadow-inner focus:ring-2 focus:ring-c-accent rounded-lg font-bold text-c-text"
                                            style={{ fontSize: '16px' }}
                                        />
                                        <button onClick={handleUpdateName} className="btn btn-sm btn-circle bg-c-accent text-white hover:opacity-90 border-none shadow-sm min-w-[36px] min-h-[36px]"><Check className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="break-all">{profile.username}</span>
                                        <button onClick={() => setIsEditingName(true)} className="btn btn-xs btn-circle btn-ghost text-c-muted hover:text-c-accent hover:bg-c-bg transition-colors min-w-[28px] min-h-[28px]"><Edit2 className="w-3.5 h-3.5" /></button>
                                    </>
                                )}
                            </h1>
                            <p className="text-c-muted font-medium tracking-wide text-xs sm:text-sm break-all">{profile.email} &bull; {isPasswordUser ? 'Password Account' : 'Google Account'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-c-border bg-c-card">
                        <div className="text-center p-3 sm:p-6 bg-c-card rounded-xl sm:rounded-2xl border border-c-border shadow-sm transition-all hover:-translate-y-1">
                            <span className="block text-2xl sm:text-4xl font-extrabold text-c-text mb-1">{stats.total}</span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest font-bold text-c-muted flex items-center justify-center gap-1"><Activity className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden xs:inline">Total</span> Posts</span>
                        </div>
                        <div className="text-center p-3 sm:p-6 bg-c-card rounded-xl sm:rounded-2xl border border-c-border shadow-sm transition-all hover:-translate-y-1">
                            <span className="block text-2xl sm:text-4xl font-extrabold text-c-text mb-1">{stats.posted}</span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest font-bold text-c-muted">Published</span>
                        </div>
                        <div className="text-center p-3 sm:p-6 bg-c-card rounded-xl sm:rounded-2xl border border-c-border shadow-sm transition-all hover:-translate-y-1">
                            <span className="block text-2xl sm:text-4xl font-extrabold text-c-text mb-1">{stats.scheduled}</span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest font-bold text-c-muted">Remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            {isPasswordUser && (
                <div className="bg-c-card rounded-2xl sm:rounded-3xl shadow-sm border border-c-border p-5 sm:p-8">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-c-text mb-4 sm:mb-6 flex items-center gap-3">
                        <div className="p-2 bg-c-accent/10 text-c-accent rounded-xl">
                            <Key className="w-5 h-5" />
                        </div>
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                        {passwordError && <div className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-2 rounded-lg">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg">{passwordSuccess}</div>}
                        <div>
                            <label className="block text-sm font-medium text-c-muted mb-1.5">Current Password</label>
                            <input type="password" className="input input-bordered w-full rounded-xl" style={{ fontSize: '16px' }} value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-c-muted mb-1.5">New Password</label>
                            <input type="password" className="input input-bordered w-full rounded-xl" style={{ fontSize: '16px' }} value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength="8" />
                        </div>
                        <button type="submit" className="btn bg-c-accent hover:opacity-90 text-white rounded-xl border-none shadow-sm w-full sm:w-auto min-h-[44px]">
                            Update Password
                        </button>
                    </form>
                </div>
            )}

            {/* Danger Zone */}
            <div className="bg-c-card rounded-2xl sm:rounded-3xl shadow-sm border-2 border-red-300 p-5 sm:p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-40 bg-red-50 rounded-full blur-3xl pointer-events-none opacity-60"></div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-red-600 mb-3 sm:mb-4 flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    Danger Zone
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-c-text text-sm">Delete your account permanently</p>
                        <p className="text-xs text-c-muted mt-0.5">This action cannot be undone. All your posts and data will be lost.</p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full sm:w-auto btn btn-outline btn-error rounded-xl font-bold min-h-[44px]"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
                    <div className="w-full max-w-sm bg-c-card sm:rounded-3xl rounded-t-3xl shadow-2xl border border-red-300 p-6 relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-red-600 mb-2">Delete Account</h3>
                        <p className="text-c-muted text-sm mb-4">
                            Type <span className="font-bold text-red-600">DELETE</span> below to confirm.
                        </p>
                        <input
                            type="text"
                            placeholder="DELETE"
                            className="input input-bordered w-full mb-4 border-red-300 focus:border-red-500"
                            style={{ fontSize: '16px' }}
                            value={deleteConfirmText}
                            onChange={e => setDeleteConfirmText(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button className="btn btn-ghost rounded-xl" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button
                                className="btn btn-error text-white rounded-xl min-h-[44px]"
                                disabled={deleteConfirmText !== 'DELETE'}
                                onClick={handleDeleteAccount}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;
