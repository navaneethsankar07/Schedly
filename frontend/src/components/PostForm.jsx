import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const PostForm = ({ isOpen, onClose, fetchPosts, postToEdit }) => {
    const [content, setContent] = useState(postToEdit ? postToEdit.content : '');
    const [scheduledTime, setScheduledTime] = useState(postToEdit ? postToEdit.scheduled_time.slice(0, 16) : '');
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { content, scheduled_time: scheduledTime };
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
                            className="mt-1 block w-full rounded-md border-base-content/20 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-base-content/80">Scheduled Time</label>
                        <input
                            type="datetime-local"
                            required
                            className="mt-1 block w-full rounded-md border-base-content/20 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
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
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 transition"
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
