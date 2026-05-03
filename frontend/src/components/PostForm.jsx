import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const PostForm = ({ isOpen, onClose, fetchPosts, postToEdit }) => {
    const [content, setContent] = useState(postToEdit ? postToEdit.content : '');
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 transition-opacity">
            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-base-content">{postToEdit ? 'Edit Post' : 'Create Post'}</h3>
                    <button onClick={onClose} className="text-base-content/40 hover:text-base-content/60 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-base-content/80">Caption</label>
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
        </div>
    );
};

export default PostForm;
