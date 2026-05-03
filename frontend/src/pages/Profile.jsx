import React, { useState, useEffect } from 'react';
import { User, Activity, Edit2, Link as LinkIcon, Check, Plus, Trash2 } from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import MascotOrb from "../components/MascotOrb";
import api from '../services/api';

const AVAILABLE_PLATFORMS = ['X', 'LinkedIn', 'Instagram', 'Facebook'];

const PLATFORM_ICONS = {
    X: <FaXTwitter className="w-5 h-5 text-neutral-900 dark:text-white" />,
    LinkedIn: <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />,
    Instagram: <FaInstagram className="w-5 h-5 text-[#E1306C]" />,
    Facebook: <FaFacebook className="w-5 h-5 text-[#1877F2]" />
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

        if (platform === 'X' && !lowerUrl.includes('twitter.com') && !lowerUrl.includes('x.com')) return "Invalid X/Twitter link.";
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
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            {/* Mascot interaction */}
            <div className="absolute -right-16 top-0 hidden lg:flex flex-col items-center gap-3">
                <div className="bg-white/80 backdrop-blur border border-white p-3 rounded-2xl shadow-xl text-sm font-semibold text-indigo-900 w-48 text-center relative floating-orb" style={{ animationDelay: '1s' }}>
                    Keep posting! You're doing great. 🚀
                    <div className="absolute -bottom-2 right-1/2 w-4 h-4 bg-white/80 border-b border-r border-white transform rotate-45"></div>
                </div>
                <MascotOrb className="w-20 h-20 floating-orb" expression="think" />
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 overflow-hidden relative">
                {/* Gradient background header */}
                <div className="h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                </div>

                <div className="p-8 pt-0 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-8">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden z-10 p-1 relative group">
                            <div className="w-full h-full bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-500">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left mb-2">
                            <h1 className="text-3xl font-extrabold text-base-content flex flex-wrap justify-center sm:justify-start items-center gap-3 tracking-tight">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="input input-sm border-indigo-200 bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 rounded-lg font-bold"
                                        />
                                        <button onClick={handleUpdateName} className="btn btn-sm btn-circle bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-md"><Check className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <>
                                        {profile.username}
                                        <button onClick={() => setIsEditingName(true)} className="btn btn-xs btn-circle btn-ghost text-base-content/40 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    </>
                                )}
                            </h1>
                            <p className="text-base-content/60 font-medium tracking-wide">{profile.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-base-200">
                        <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100/50 shadow-sm glass-card">
                            <span className="block text-4xl font-extrabold text-indigo-600 mb-2">{stats.total}</span>
                            <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 flex items-center justify-center gap-1.5"><Activity className="w-4 h-4" /> Total Posts</span>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100/50 shadow-sm glass-card">
                            <span className="block text-4xl font-extrabold text-emerald-500 mb-2">{stats.posted}</span>
                            <span className="text-xs uppercase tracking-widest font-bold text-emerald-600/70">Published</span>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100/50 shadow-sm glass-card">
                            <span className="block text-4xl font-extrabold text-amber-500 mb-2">{stats.scheduled}</span>
                            <span className="text-xs uppercase tracking-widest font-bold text-amber-600/70">Remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-8 glass-card">
                <h2 className="text-2xl font-extrabold text-base-content mb-8 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <LinkIcon className="w-6 h-6" />
                    </div>
                    Social Integrations
                </h2>

                <div className="mb-8 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl space-y-4 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10 justify-between">
                        <div className="flex gap-4 w-full">
                            <select
                                value={platformToAdd}
                                onChange={e => setPlatformToAdd(e.target.value)}
                                className="select select-bordered border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 w-full sm:w-1/3 rounded-xl font-medium"
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
                                className="input input-bordered border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 flex-1 w-full rounded-xl"
                                disabled={!platformToAdd}
                            />
                        </div>
                        <button onClick={handleConnectPlatform} disabled={!platformToAdd || !platformUrl} className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto rounded-xl border-none shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mr-1" />
                            Connect
                        </button>
                    </div>
                    {urlError && <p className="text-sm font-bold text-red-500 absolute -bottom-6 left-2">{urlError}</p>}
                </div>

                <div className="space-y-4 mt-8">
                    {connectedPlatforms.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                            No social accounts connected yet.
                        </div>
                    ) : (
                        connectedPlatforms.map(plat => (
                            <div key={plat.name} className="flex items-center justify-between p-5 border border-gray-100 bg-white rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary border border-gray-100 group-hover:scale-110 transition-transform">
                                        {PLATFORM_ICONS[plat.name] || <LinkIcon className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <span className="font-extrabold text-base-content flex items-center gap-3 text-lg">
                                            {plat.name}
                                            <span className="badge bg-emerald-100 text-emerald-700 border-none badge-sm font-bold px-2 py-3 rounded-md">Connected</span>
                                        </span>
                                        <a href={plat.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-500 hover:text-indigo-700 font-medium hover:underline block max-w-[200px] sm:max-w-xs truncate">
                                            {plat.url}
                                        </a>
                                    </div>
                                </div>
                                <button onClick={() => handleDisconnectPlatform(plat.name)} className="btn btn-ghost btn-circle text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
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
