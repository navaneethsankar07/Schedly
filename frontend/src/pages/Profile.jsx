import React, { useState, useEffect } from 'react';
import { User, Activity, Edit2, Link as LinkIcon, Check, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const AVAILABLE_PLATFORMS = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ total: 0, posted: 0, scheduled: 0 });
    const [isEditingName, setIsEditingName] = useState(false);
    const [username, setUsername] = useState('');
    const [platformToAdd, setPlatformToAdd] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('user/profile/');
            setProfile(res.data);
            setUsername(res.data.username);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async () => {
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

    const handleConnectPlatform = async () => {
        if (!platformToAdd) return;
        try {
            const currentPlatforms = profile?.profile?.connected_platforms || [];
            if (currentPlatforms.includes(platformToAdd)) return;

            const newPlatforms = [...currentPlatforms, platformToAdd];
            await api.put('user/profile/', { connected_platforms: newPlatforms });
            setPlatformToAdd('');
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDisconnectPlatform = async (plat) => {
        try {
            const currentPlatforms = profile?.profile?.connected_platforms || [];
            const newPlatforms = currentPlatforms.filter(p => p !== plat);
            await api.put('user/profile/', { connected_platforms: newPlatforms });
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div className="p-8 text-center text-base-content/50">Loading profile...</div>;

    const connectedPlatforms = profile.profile?.connected_platforms || [];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-base-100 shadow-lg">
                        <User className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="input input-sm input-bordered"
                                    />
                                    <button onClick={handleUpdateName} className="btn btn-sm btn-circle btn-primary"><Check className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <>
                                    {profile.username}
                                    <button onClick={() => setIsEditingName(true)} className="btn btn-xs btn-ghost text-base-content/50 hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                                </>
                            )}
                        </h1>
                        <p className="text-base-content/60">{profile.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-base-200 pt-8">
                    <div className="text-center p-4 bg-base-200 rounded-xl">
                        <span className="block text-3xl font-black text-primary mb-1">{stats.total}</span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-base-content/60 flex items-center justify-center gap-1"><Activity className="w-3 h-3" /> Total Posts</span>
                    </div>
                    <div className="text-center p-4 bg-emerald-500/10 rounded-xl">
                        <span className="block text-3xl font-black text-emerald-600 mb-1">{stats.posted}</span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600/80">Published</span>
                    </div>
                    <div className="text-center p-4 bg-amber-500/10 rounded-xl">
                        <span className="block text-3xl font-black text-amber-600 mb-1">{stats.scheduled}</span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-amber-600/80">Remaining</span>
                    </div>
                </div>
            </div>

            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-8">
                <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    Social Integrations
                </h2>

                <div className="flex items-center gap-4 mb-8 p-4 bg-base-200 rounded-xl">
                    <select
                        value={platformToAdd}
                        onChange={e => setPlatformToAdd(e.target.value)}
                        className="select select-bordered flex-1"
                    >
                        <option value="">Select platform to connect...</option>
                        {AVAILABLE_PLATFORMS.filter(p => !connectedPlatforms.includes(p)).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <button onClick={handleConnectPlatform} disabled={!platformToAdd} className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                    </button>
                </div>

                <div className="space-y-3">
                    {connectedPlatforms.length === 0 ? (
                        <div className="text-center p-8 bg-base-200/50 rounded-xl border border-dashed border-base-300 text-base-content/50">
                            No social accounts connected yet.
                        </div>
                    ) : (
                        connectedPlatforms.map(plat => (
                            <div key={plat} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {plat.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-base-content">{plat}</span>
                                    <span className="badge badge-success badge-sm">Connected</span>
                                </div>
                                <button onClick={() => handleDisconnectPlatform(plat)} className="btn btn-ghost btn-sm text-error/70 hover:bg-error/10 hover:text-error">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
