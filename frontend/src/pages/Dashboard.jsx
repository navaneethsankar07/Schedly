import React, { useState } from 'react';
import api from '../services/api';
import PostForm from '../components/PostForm';
import { Pencil, Trash2, CheckCircle, Plus, Globe, LockKeyhole, LayoutTemplate, FileText, X as XIcon, BookOpen } from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CountUpNumber from '../components/CountUpNumber';
import TutorialOverlay from '../components/TutorialOverlay';
import MascotOrb from '../components/MascotOrb';

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
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ title: '', content: '' });

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

    const deleteTemplateMutation = useMutation({
        mutationFn: async (id) => { await api.delete(`templates/${id}/`); },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] })
    });

    const createTemplateMutation = useMutation({
        mutationFn: async (payload) => { await api.post('templates/', payload); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            setShowTemplateModal(false);
            setNewTemplate({ title: '', content: '' });
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
        <div className="space-y-8 relative">
            <TutorialOverlay />

            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl p-8 overflow-hidden shadow-lg border border-white/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/3 float-slow pointer-events-none"></div>
                <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl transform translate-y-1/2 -translate-x-1/2 float-delayed pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10 w-full text-white">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <MascotOrb className="w-16 h-16 drop-shadow-md" expression="smile" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">Your Workspace</h1>
                            <p className="text-white/80 font-medium mt-1">Let's plan your next big moment.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setPostToEdit(null); setPrefillContent(''); setIsFormOpen(true); }}
                        className="inline-flex items-center px-6 py-2.5 border border-white/20 text-sm font-bold text-indigo-900 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Post
                    </button>
                </div>
            </div>

            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl glass-card relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors"></div>
                        <p className="text-xs text-base-content/60 font-bold uppercase tracking-widest">Total Posts</p>
                        <p className="text-4xl font-extrabold text-base-content mt-2 drop-shadow-sm"><CountUpNumber value={analytics.total_posts} /></p>
                    </div>
                    <div className="p-6 rounded-3xl glass-card relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
                        <p className="text-xs text-base-content/60 font-bold uppercase tracking-widest">Scheduled</p>
                        <p className="text-4xl font-extrabold text-blue-600 mt-2 drop-shadow-sm"><CountUpNumber value={analytics.scheduled_posts} /></p>
                    </div>
                    <div className="p-6 rounded-3xl glass-card relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <p className="text-xs text-base-content/60 font-bold uppercase tracking-widest">Completed</p>
                        <p className="text-4xl font-extrabold text-emerald-600 mt-2 drop-shadow-sm"><CountUpNumber value={analytics.posted_posts} /></p>
                    </div>
                    <div className="p-6 rounded-3xl glass-card border-orange-200 bg-gradient-to-br from-orange-50/50 to-pink-50/50 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl group-hover:bg-orange-400/30 transition-colors"></div>
                        <p className="text-xs text-orange-700 font-bold uppercase tracking-widest">Current Streak 🔥</p>
                        <p className="text-4xl font-extrabold text-orange-600 mt-2 drop-shadow-sm"><CountUpNumber value={analytics.current_streak} /> <span className="text-sm font-medium tracking-normal opacity-80">days</span></p>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
                <div className="flex space-x-2 bg-base-200/50 p-1 rounded-full backdrop-blur-sm">
                    {['all', 'upcoming', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${filter === f ? 'bg-white text-indigo-700 shadow-md transform scale-105' : 'text-base-content/60 hover:text-base-content/80 hover:bg-white/50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-base-content/70 font-semibold tracking-wide">Platform:</span>
                    <div className="relative">
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="appearance-none rounded-full border-white/40 bg-white/70 backdrop-blur-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 outline-none sm:text-sm pl-4 pr-10 py-2 text-base-content font-medium transition cursor-pointer hover:bg-white"
                        >
                            <option value="All">All Categories</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="X">X (Twitter)</option>
                            <option value="Facebook">Facebook</option>
                            <option value="General">General</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-base-content/50">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Templates Section ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-base-content flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-primary" />
                        Templates
                    </h2>
                    <button
                        onClick={() => setShowTemplateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-primary text-primary-content hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Create Template
                    </button>
                </div>

                {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 rounded-3xl border-2 border-dashed border-base-300 bg-base-200 text-center gap-4">
                        <MascotOrb className="w-20 h-20" expression="think" />
                        <div>
                            <p className="font-bold text-base-content text-lg">No templates yet</p>
                            <p className="text-base-content/60 text-sm mt-1">Save your best captions as reusable templates.</p>
                        </div>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-content hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Create your first template
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {templates.map(template => (
                            <div key={template.id} className="post-card bg-base-100 rounded-2xl border border-base-300/60 p-5 flex flex-col justify-between gap-4 group">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold text-base-content text-sm leading-tight line-clamp-1">{template.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => deleteTemplateMutation.mutate(template.id)}
                                            className="text-base-content/30 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete template"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-base-content/60 line-clamp-3 leading-relaxed">{template.content}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPostToEdit(null);
                                        setPrefillContent(template.content);
                                        setIsFormOpen(true);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition-all"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Use Template
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Create Template Modal ── */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)}>
                    <div className="w-full max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                            <h3 className="text-lg font-extrabold text-base-content flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-primary" />
                                New Template
                            </h3>
                            <button onClick={() => setShowTemplateModal(false)} className="btn btn-ghost btn-sm btn-circle">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-base-content mb-1.5">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Monday motivation post"
                                    value={newTemplate.title}
                                    onChange={e => setNewTemplate(t => ({ ...t, title: e.target.value }))}
                                    className="input input-bordered w-full rounded-xl text-base-content"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-base-content mb-1.5">Content</label>
                                <textarea
                                    rows={5}
                                    placeholder="Write your template caption here..."
                                    value={newTemplate.content}
                                    onChange={e => setNewTemplate(t => ({ ...t, content: e.target.value }))}
                                    className="textarea textarea-bordered w-full rounded-xl text-base-content resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button onClick={() => setShowTemplateModal(false)} className="btn btn-ghost rounded-xl">Cancel</button>
                            <button
                                disabled={!newTemplate.title.trim() || !newTemplate.content.trim() || createTemplateMutation.isPending}
                                onClick={() => createTemplateMutation.mutate(newTemplate)}
                                className="btn btn-primary rounded-xl"
                            >
                                {createTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => {
                    const pastDue = isPastDue(post);
                    return (
                        <div key={post.id} className="post-card bg-base-100 rounded-2xl shadow-sm border border-base-300/60 overflow-hidden hover:border-indigo-200 transition-colors">
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
