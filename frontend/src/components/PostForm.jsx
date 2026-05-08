import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const PostForm = ({ isOpen, onClose, postToEdit, prefillContent }) => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState(postToEdit ? postToEdit.content : (prefillContent || ''));
    const [platform, setPlatform] = useState(postToEdit ? postToEdit.platform : 'General');
    const [username, setUsername] = useState(postToEdit ? postToEdit.username : '');
    const [isImproving, setIsImproving] = useState(false);

    const toLocalInputValue = (utcStr) => {
        if (!utcStr) return '';
        const d = new Date(utcStr);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const [scheduledTime, setScheduledTime] = useState(postToEdit ? toLocalInputValue(postToEdit.scheduled_time) : '');
    const [timeSuggestions, setTimeSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('form'); // 'form' | 'preview' — for mobile tabs

    useEffect(() => {
        if (prefillContent) setContent(prefillContent);
    }, [prefillContent]);

    if (!isOpen) return null;

    const isPastDue = postToEdit && new Date(postToEdit.scheduled_time) <= new Date();
    if (isPastDue) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-c-card rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-c-border flex justify-between items-center">
                        <h3 className="text-base font-semibold text-c-text">Edit Post</h3>
                        <button onClick={onClose} className="text-c-muted hover:text-c-text transition p-1"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="px-5 py-8 text-center space-y-3">
                        <div className="text-4xl">🔒</div>
                        <p className="text-c-text font-medium">This post cannot be edited.</p>
                        <p className="text-sm text-c-muted">The scheduled time has already passed.<br />Past-due posts are locked to preserve the record.</p>
                        <button onClick={onClose} className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-c-accent rounded-lg hover:opacity-90 transition min-h-[40px]">
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const utcIso = new Date(scheduledTime).toISOString();
            const payload = { content, platform, scheduled_time: utcIso, username };
            if (postToEdit) {
                await api.put(`posts/${postToEdit.id}/`, payload);
            } else {
                await api.post('posts/', payload);
            }
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            onClose();
        } catch (err) {
            setError(err.response?.data?.scheduled_time?.[0] || 'Error submitting post');
        }
    };

    const handleImproveCaption = async () => {
        if (!content || isImproving) return;
        setIsImproving(true);
        try {
            const res = await api.post('caption/improve/', { content });
            setContent(res.data.improved_content);
        } catch (err) {
            console.error("Improve caption failed", err);
        } finally {
            setIsImproving(false);
        }
    };

    const handleSuggestTime = async () => {
        try {
            const res = await api.get('suggestions/time/');
            if (Array.isArray(res.data)) {
                setTimeSuggestions(timeSuggestions.length > 0 ? [] : res.data);
            }
        } catch (err) { console.error("Suggest time failed", err); }
    };

    const applyTimeSuggestion = (timeStr) => {
        let datePart = '';
        if (scheduledTime && scheduledTime.includes('T')) {
            datePart = scheduledTime.split('T')[0];
        } else {
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        }
        setScheduledTime(`${datePart}T${timeStr}`);
        setTimeSuggestions([]);
    };

    /* ── Preview Components ── */
    const InstagramPreview = () => (
        <div className="bg-c-card border border-c-border rounded-[20px] w-full max-w-[300px] pb-4 shadow-sm overflow-hidden flex flex-col mx-auto">
            <div className="flex items-center p-3 border-b border-c-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full bg-c-card rounded-full flex items-center justify-center text-[10px] font-bold text-c-text">You</div>
                </div>
                <div className="ml-2 font-semibold text-sm text-c-text">{username || 'your_username'}</div>
            </div>
            <div className="w-full aspect-square bg-c-bg flex items-center justify-center text-c-muted text-sm">[Media]</div>
            <div className="flex px-3 py-2 space-x-3 text-c-muted">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.543 1.117 1.543s.277-.368 1.117-1.543a4.21 4.21 0 013.675-1.941z" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </div>
            <div className="px-3 text-sm text-c-text">
                <span className="font-semibold mr-1">{username || 'your_username'}</span>
                <span className="whitespace-pre-wrap">{content || 'Your caption will appear here...'}</span>
            </div>
        </div>
    );

    const LinkedInPreview = () => (
        <div className="bg-c-card border border-c-border rounded-lg w-full max-w-[300px] pb-4 shadow-sm overflow-hidden flex flex-col mx-auto">
            <div className="flex items-center p-3">
                <div className="w-10 h-10 rounded-full bg-c-bg flex items-center justify-center text-xs font-bold text-c-muted flex-shrink-0">You</div>
                <div className="ml-3">
                    <span className="font-semibold text-sm text-c-text block">{username || 'Your Name'}</span>
                    <span className="text-xs text-c-muted">Professional Title • 1st</span>
                </div>
            </div>
            <div className="px-3 mb-2 text-sm text-c-text whitespace-pre-wrap">{content || 'What do you want to talk about?'}</div>
            <div className="w-full aspect-video bg-c-bg flex items-center justify-center text-c-muted text-sm border-y border-c-border">[Media]</div>
            <div className="flex px-3 py-2 space-x-4 text-c-muted text-xs font-medium">
                <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span>
            </div>
        </div>
    );

    const XPreview = () => (
        <div className="bg-c-card border border-c-border rounded-xl w-full max-w-[300px] p-4 shadow-sm overflow-hidden flex flex-col mx-auto">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-c-bg flex items-center justify-center text-xs font-bold text-c-muted flex-shrink-0">You</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                        <span className="font-bold text-sm text-c-text">{username || 'Your Name'}</span>
                        <span className="text-sm text-c-muted">@{username || 'your_username'}</span>
                    </div>
                    <div className="mt-1 text-sm text-c-text whitespace-pre-wrap break-words">{content || "What's happening?"}</div>
                    <div className="flex gap-4 text-c-muted mt-3 text-xs">
                        <span>💬</span><span>🔁</span><span>❤️</span><span>📊</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const PreviewContent = () => {
        if (platform === 'LinkedIn') return <LinkedInPreview />;
        if (platform === 'X') return <XPreview />;
        return <InstagramPreview />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-c-card w-full sm:rounded-xl shadow-xl sm:max-w-4xl flex flex-col overflow-hidden" style={{ maxHeight: '95vh' }}>

                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-c-border flex justify-between items-center flex-shrink-0">
                    <h3 className="text-base sm:text-lg font-semibold text-c-text">{postToEdit ? 'Edit Post' : 'Create Post'}</h3>
                    <button onClick={onClose} className="text-c-muted hover:text-c-text transition p-1"><X className="w-5 h-5" /></button>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden flex border-b border-c-border flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'form' ? 'text-c-accent border-b-2 border-c-accent' : 'text-c-muted'}`}
                    >
                        Form
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'preview' ? 'text-c-accent border-b-2 border-c-accent' : 'text-c-muted'}`}
                    >
                        Preview
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    {/* Form Side */}
                    <div className={`flex-1 flex flex-col overflow-y-auto ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
                        <form onSubmit={handleSubmit} className="flex-1 px-4 sm:px-6 py-4 space-y-4">
                            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                            {/* Caption */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-medium text-c-muted">Caption</label>
                                    <button
                                        type="button"
                                        onClick={handleImproveCaption}
                                        disabled={isImproving}
                                        className="text-xs text-c-accent hover:opacity-80 font-semibold bg-c-accent/10 px-2.5 py-1 rounded-full transition disabled:opacity-50 min-h-[28px]"
                                    >
                                        {isImproving ? '⏳ Improving...' : '✨ Improve Caption'}
                                    </button>
                                </div>
                                <textarea
                                    required
                                    className="mt-0.5 block w-full rounded-lg border border-c-border bg-c-bg text-c-text shadow-sm focus:border-c-accent focus:ring-1 focus:ring-c-accent text-sm p-3 resize-none"
                                    style={{ fontSize: '16px' }}
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            {/* Platform */}
                            <div>
                                <label className="block text-sm font-medium text-c-muted mb-1.5">Platform</label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="block w-full rounded-lg border border-c-border bg-c-bg text-c-text shadow-sm focus:border-c-accent text-sm p-3"
                                    style={{ fontSize: '16px' }}
                                >
                                    <option value="General">General</option>
                                    <option value="X">X (Twitter)</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                </select>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-c-muted mb-1.5">Username (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="your_username"
                                    className="block w-full rounded-lg border border-c-border bg-c-bg text-c-text shadow-sm focus:border-c-accent text-sm p-3"
                                    style={{ fontSize: '16px' }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Scheduled Time */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-medium text-c-muted">Scheduled Time</label>
                                    <button type="button" onClick={handleSuggestTime} className="text-xs text-c-accent hover:opacity-80 font-semibold bg-c-accent/10 px-2.5 py-1 rounded-full transition min-h-[28px]">
                                        🕒 Suggest Time
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    required
                                    className="mt-0.5 block w-full rounded-lg border border-c-border bg-c-bg text-c-text shadow-sm focus:border-c-accent text-sm p-3"
                                    style={{ fontSize: '16px' }}
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                />
                                {timeSuggestions.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {timeSuggestions.map((t, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => applyTimeSuggestion(t)}
                                                className="px-3 py-1.5 bg-c-accent/10 text-c-accent text-xs rounded-lg border border-c-accent/20 hover:bg-c-accent/20 transition min-h-[32px]"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-2 pb-2 flex justify-end gap-3 border-t border-c-border">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-sm font-medium text-c-muted border border-c-border rounded-lg hover:bg-c-bg transition min-h-[40px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-c-accent rounded-lg hover:opacity-90 transition min-h-[40px]"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Side */}
                    <div className={`w-full md:w-80 lg:w-96 bg-c-bg border-t md:border-t-0 md:border-l border-c-border flex flex-col ${activeTab === 'form' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="px-5 py-4 border-b border-c-border bg-c-card flex-shrink-0">
                            <h3 className="text-sm font-semibold text-c-text">Preview</h3>
                        </div>
                        <div className="flex-1 p-4 sm:p-6 flex justify-center items-start overflow-y-auto">
                            <PreviewContent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostForm;
