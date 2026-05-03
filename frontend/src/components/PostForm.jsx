import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const PostForm = ({ isOpen, onClose, fetchPosts, postToEdit, prefillContent }) => {
    const [content, setContent] = useState(postToEdit ? postToEdit.content : (prefillContent || ''));
    const [platform, setPlatform] = useState(postToEdit ? postToEdit.platform : 'General');
    // Prefill edit form: convert stored UTC ISO string → local datetime-local string
    const toLocalInputValue = (utcStr) => {
        if (!utcStr) return '';
        const d = new Date(utcStr);
        // datetime-local format: YYYY-MM-DDTHH:mm
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const [scheduledTime, setScheduledTime] = useState(postToEdit ? toLocalInputValue(postToEdit.scheduled_time) : '');
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    // Guard: prevent editing posts whose scheduled time has already passed
    const isPastDue = postToEdit && new Date(postToEdit.scheduled_time) <= new Date();
    if (isPastDue) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
                <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-base-content">Edit Post</h3>
                        <button onClick={onClose} className="text-base-content/40 hover:text-base-content/60 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="px-6 py-8 text-center space-y-3">
                        <div className="text-4xl">🔒</div>
                        <p className="text-base-content font-medium">This post cannot be edited.</p>
                        <p className="text-sm text-base-content/60">
                            The scheduled time for this post has already passed.<br />
                            Past-due posts are locked to preserve the record.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition"
                        >
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
            // Convert the local datetime-local value to a UTC ISO string for Django
            const utcIso = new Date(scheduledTime).toISOString();
            const payload = { content, platform, scheduled_time: utcIso };
            if (postToEdit) {
                await api.put(`posts/${postToEdit.id}/`, payload);
            } else {
                await api.post('posts/', payload);
            }
            fetchPosts();
            onClose();
        } catch (err) {
            setError(err.response?.data?.scheduled_time?.[0] || 'Error submitting post');
        }
    };

    const handleImproveCaption = async () => {
        if (!content) return;
        try {
            const res = await api.post('caption/improve/', { content });
            setContent(res.data.improved_content);
        } catch (err) {
            console.error("Improve caption failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 transition-opacity">
            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden transform transition-all h-[80vh]">
                {/* Left Side: Form */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-base-content">{postToEdit ? 'Edit Post' : 'Create Post'}</h3>
                        <button onClick={onClose} className="text-base-content/40 hover:text-base-content/60 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-base-content/80">Caption</label>
                                <button
                                    type="button"
                                    onClick={handleImproveCaption}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded"
                                >
                                    ✨ Improve Caption
                                </button>
                            </div>
                            <textarea
                                required
                                className="mt-1 block w-full rounded-md border-base-content/20 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content/80 mb-1">Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="block w-full rounded-md border-base-content/20 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                            >
                                <option value="General">General</option>
                                <option value="X">X</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Facebook">Facebook</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content/80">Scheduled Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="mt-1 block w-full rounded-md border-base-content/20 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-base-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-base-content/80 bg-base-100 border border-base-content/20 rounded-md shadow-sm hover:bg-base-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                {/* Right Side: Preview */}
                <div className="w-full md:w-96 bg-gray-50 flex flex-col border-t md:border-t-0 md:border-l border-base-300">
                    <div className="px-6 py-4 border-b border-base-300 bg-base-100 flex-shrink-0">
                        <h3 className="text-lg font-medium text-base-content">Preview</h3>
                    </div>
                    <div className="flex-1 p-6 flex justify-center items-start overflow-y-auto bg-gray-100">
                        <div className="bg-white border border-gray-200 rounded-[30px] w-full max-w-[320px] pb-4 shadow-sm overflow-hidden flex flex-col">
                            {/* Instagram style header */}
                            <div className="flex items-center p-3 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-bold">You</div>
                                </div>
                                <div className="ml-2 font-semibold text-sm">your_account</div>
                            </div>
                            {/* Image placeholder */}
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                [Media Content]
                            </div>
                            {/* Actions / Icons dummy */}
                            <div className="flex px-3 py-2 space-x-3 text-gray-600">
                                <svg aria-label="Like" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.543 1.117 1.543s.277-.368 1.117-1.543a4.21 4.21 0 013.675-1.941z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
                                <svg aria-label="Comment" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
                                <svg aria-label="Share" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><line points="22 3 9.218 10.083" fill="none" stroke="currentColor" strokeWidth="2"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" fill="none" stroke="currentColor" strokeWidth="2"></polygon></svg>
                            </div>
                            {/* Caption preview */}
                            <div className="px-3 text-sm text-gray-800">
                                <span className="font-semibold mr-1">your_account</span>
                                <span className="whitespace-pre-wrap">{content || 'Your caption will appear here...'}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostForm;
