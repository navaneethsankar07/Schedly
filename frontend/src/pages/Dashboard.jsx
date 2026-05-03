import React, { useState } from 'react';
import api from '../services/api';
import PostForm from '../components/PostForm';
import { Pencil, Trash2, CheckCircle, Plus, Globe, LockKeyhole } from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PLATFORM_ICONS = {
    X: <FaXTwitter className="w-3.5 h-3.5 flex-shrink-0 text-neutral-900 dark:text-white" />,
    LinkedIn: <FaLinkedin className="w-3.5 h-3.5 flex-shrink-0 text-[#0A66C2]" />,
    Instagram: <FaInstagram className="w-3.5 h-3.5 flex-shrink-0 text-[#E1306C]" />,
    Facebook: <FaFacebook className="w-3.5 h-3.5 flex-shrink-0 text-[#1877F2]" />,
    General: <Globe className="w-3.5 h-3.5 flex-shrink-0" />
};

const Dashboard = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [prefillContent, setPrefillContent] = useState('');

    const { data: posts = [] } = useQuery({
        queryKey: ['posts', platformFilter.toLowerCase()],
        queryFn: async () => {
            const res = await api.get(`posts/?category=${platformFilter.toLowerCase()}`);
            return res.data;
        }
    });

    const { data: templates = [] } = useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const res = await api.get('templates/');
            return res.data;
        }
    });

    const { data: analytics = null } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await api.get('analytics/');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`posts/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });

    const markPostedMutation = useMutation({
        mutationFn: async (id) => {
            await api.patch(`posts/${id}/mark-posted/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) {
            deleteMutation.mutate(id);
        }
    };

    const markPosted = (id) => {
        markPostedMutation.mutate(id);
    };

    // A post is "past due" if its scheduled_time is in the past
    const isPastDue = (post) => {
        // Use the serializer-provided field if available, else compute it
        if (typeof post.is_past_due === 'boolean') return post.is_past_due;
        return new Date(post.scheduled_time) <= new Date();
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'upcoming') return post.status === 'scheduled';
        if (filter === 'completed') return post.status === 'posted';
        return true;
    }).sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-base-content">Dashboard</h1>
                <button
                    onClick={() => { setPostToEdit(null); setPrefillContent(''); setIsFormOpen(true); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                </button>
            </div>

            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
                        <p className="text-sm text-base-content/60 font-medium">Total Posts</p>
                        <p className="text-2xl font-bold text-base-content mt-1">{analytics.total_posts}</p>
                    </div>
                    <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
                        <p className="text-sm text-base-content/60 font-medium">Scheduled</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{analytics.scheduled_posts}</p>
                    </div>
                    <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
                        <p className="text-sm text-base-content/60 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">{analytics.posted_posts}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl shadow-sm border border-emerald-200">
                        <p className="text-sm text-emerald-800 font-medium">Current Streak 🔥</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">{analytics.current_streak} days</p>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-2">
                <div className="flex space-x-2">
                    {['all', 'upcoming', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${filter === f ? 'bg-emerald-100 text-emerald-700' : 'text-base-content/60 hover:text-base-content/80 hover:bg-base-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-base-content/70">Platform:</span>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="rounded-md border-base-content/20 bg-base-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border text-base-content"
                    >
                        <option value="All">All Categories</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="X">X</option>
                        <option value="Facebook">Facebook</option>
                        <option value="General">General</option>
                    </select>
                </div>
            </div>

            {templates.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-base-content mb-3">Templates</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {templates.map(template => (
                            <div key={template.id} className="min-w-[250px] bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-base-content">{template.title}</h3>
                                    <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{template.content}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPostToEdit(null);
                                        setPrefillContent(template.content);
                                        setIsFormOpen(true);
                                    }}
                                    className="mt-4 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md hover:bg-emerald-200 transition text-center"
                                >
                                    Use Template
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => {
                    const pastDue = isPastDue(post);
                    return (
                        <div key={post.id} className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition">
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'posted' ? 'bg-green-100 text-green-800' : pastDue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.status === 'posted' ? 'POSTED' : pastDue ? 'OVERDUE' : 'SCHEDULED'}
                                        </span>
                                        {post.platform && post.platform !== 'General' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200 text-base-content shadow-sm border border-base-300">
                                                {PLATFORM_ICONS[post.platform] || PLATFORM_ICONS['General']}
                                                {post.platform}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        {/* Edit button — disabled when past due */}
                                        {pastDue ? (
                                            <span
                                                title="Cannot edit: scheduled time has already passed"
                                                className="text-base-content/20 cursor-not-allowed"
                                            >
                                                <LockKeyhole className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => { setPostToEdit(post); setIsFormOpen(true); }}
                                                className="text-base-content/40 hover:text-emerald-600 transition"
                                                title="Edit post"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-base-content/40 hover:text-red-600 transition"
                                            title="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-base-content whitespace-pre-wrap line-clamp-4">{post.content}</p>
                                <div className={`mt-4 text-xs flex items-center gap-1 ${pastDue && post.status !== 'posted' ? 'text-red-500' : 'text-base-content/60'}`}>
                                    {pastDue && post.status !== 'posted' && (
                                        <span className="mr-0.5">⚠️</span>
                                    )}
                                    {format(new Date(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                                </div>
                            </div>
                            {post.status === 'scheduled' && (
                                <div className="bg-base-200 px-5 py-3 border-t border-base-200">
                                    <button
                                        onClick={() => markPosted(post.id)}
                                        className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Mark as Posted
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredPosts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-base-content/60">
                        No posts found.
                    </div>
                )}
            </div>

            <PostForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                postToEdit={postToEdit}
                prefillContent={prefillContent}
            />
        </div>
    );
};

export default Dashboard;
