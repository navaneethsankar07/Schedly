import React, { useState, useEffect } from 'react';
import { User, Activity, Edit2, Link as LinkIcon, Check, Plus, Trash2, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import api from '../services/api';

const AVAILABLE_PLATFORMS = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];

const PLATFORM_ICONS = {
    Twitter: <Twitter className="w-5 h-5" />,
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Instagram: <Instagram className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />
};

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ total: 0, posted: 0, scheduled: 0 });
    const [isEditingName, setIsEditingName] = useState(false);
    const [username, setUsername] = useState('');

    const [platformToAdd, setPlatformToAdd] = useState('');
    const [platformUrl, setPlatformUrl] = useState('');
    const [urlError, setUrlError] = useState('');

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

    const validateUrl = (platform, url) => {
        const lowerUrl = url.toLowerCase();
        if (!lowerUrl.startsWith('http')) return "URL must start with http:// or https://";

        if (platform === 'Twitter' && !lowerUrl.includes('twitter.com') && !lowerUrl.includes('x.com')) return "Invalid Twitter/X link.";
        if (platform === 'LinkedIn' && !lowerUrl.includes('linkedin.com')) return "Invalid LinkedIn link.";
        if (platform === 'Instagram' && !lowerUrl.includes('instagram.com')) return "Invalid Instagram link.";
        if (platform === 'Facebook' && !lowerUrl.includes('facebook.com')) return "Invalid Facebook link.";

        return "";
    };

    const handleConnectPlatform = async () => {
        if (!platformToAdd || !platformUrl) return;

        const errorMsg = validateUrl(platformToAdd, platformUrl);
        if (errorMsg) {
            setUrlError(errorMsg);
            return;
        }
        setUrlError('');

        try {
            // In python/JSON it sits as an array. Might be mixed from older versions (strings vs objects).
            let currentPlatforms = profile?.profile?.connected_platforms || [];

            // Upgrade migrating old purely-string data
            currentPlatforms = currentPlatforms.map(p => typeof p === 'string' ? { name: p, url: '' } : p);

            if (currentPlatforms.find(p => p.name === platformToAdd)) return;

            const newPlatforms = [...currentPlatforms, { name: platformToAdd, url: platformUrl }];
            await api.put('user/profile/', { connected_platforms: newPlatforms });

            setPlatformToAdd('');
            setPlatformUrl('');
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDisconnectPlatform = async (platName) => {
        try {
            let currentPlatforms = profile?.profile?.connected_platforms || [];
            currentPlatforms = currentPlatforms.map(p => typeof p === 'string' ? { name: p, url: '' } : p);

            const newPlatforms = currentPlatforms.filter(p => p.name !== platName);
            await api.put('user/profile/', { connected_platforms: newPlatforms });
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div className="p-8 text-center text-base-content/50">Loading profile...</div>;

    let connectedPlatforms = profile.profile?.connected_platforms || [];
    connectedPlatforms = connectedPlatforms.map(p => typeof p === 'string' ? { name: p, url: 'N/A' } : p);
    const connectedNames = connectedPlatforms.map(p => p.name);

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

                <div className="mb-8 p-4 bg-base-200 rounded-xl space-y-3 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <select
                            value={platformToAdd}
                            onChange={e => setPlatformToAdd(e.target.value)}
                            className="select select-bordered w-full sm:w-1/3"
                        >
                            <option value="">Select platform...</option>
                            {AVAILABLE_PLATFORMS.filter(p => !connectedNames.includes(p)).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder={`e.g. https://${platformToAdd ? platformToAdd.toLowerCase() : 'example'}.com/yourprofile`}
                            value={platformUrl}
                            onChange={e => {
                                setPlatformUrl(e.target.value);
                                setUrlError('');
                            }}
                            className="input input-bordered flex-1 w-full"
                            disabled={!platformToAdd}
                        />
                        <button onClick={handleConnectPlatform} disabled={!platformToAdd || !platformUrl} className="btn btn-primary w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                        </button>
                    </div>
                    {urlError && <p className="text-sm font-medium text-error absolute -bottom-6 left-2">{urlError}</p>}
                </div>

                <div className="space-y-3 mt-8">
                    {connectedPlatforms.length === 0 ? (
                        <div className="text-center p-8 bg-base-200/50 rounded-xl border border-dashed border-base-300 text-base-content/50">
                            No social accounts connected yet.
                        </div>
                    ) : (
                        connectedPlatforms.map(plat => (
                            <div key={plat.name} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        {PLATFORM_ICONS[plat.name] || <LinkIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-base-content flex items-center gap-2">
                                            {plat.name}
                                            <span className="badge badge-success badge-sm">Connected</span>
                                        </span>
                                        <a href={plat.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline block max-w-[200px] sm:max-w-xs truncate">
                                            {plat.url}
                                        </a>
                                    </div>
                                </div>
                                <button onClick={() => handleDisconnectPlatform(plat.name)} className="btn btn-ghost btn-sm text-error/70 hover:bg-error/10 hover:text-error">
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
