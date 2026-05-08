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
import GoalSection from '../components/GoalSection';

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
        mutationFn: async (id) => { await api.delete(`posts/${id}/`); },
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
        mutationFn: async (id) => { await api.patch(`posts/${id}/mark-posted/`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) deleteMutation.mutate(id);
    };

    const isPastDue = (post) => {
        if (typeof post.is_past_due === 'boolean') return post.is_past_due;
        return new Date(post.scheduled_time) <= new Date();
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'upcoming') return post.status === 'scheduled';
        if (filter === 'completed') return post.status === 'posted';
        return true;
    }).sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    return (
        <div className="space-y-5 sm:space-y-7 relative">
            <TutorialOverlay />

            {/* Header */}
            <div className="relative bg-c-card rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden shadow-sm border border-c-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <MascotOrb className="w-14 h-14 lg:w-16 lg:h-16 drop-shadow-sm" expression="smile" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-c-text">Your Workspace</h1>
                            <p className="text-sm text-c-muted font-medium mt-0.5">Let's plan your next big moment.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setPostToEdit(null); setPrefillContent(''); setIsFormOpen(true); }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-c-accent rounded-full shadow-sm hover:opacity-90 transition-all hover:-translate-y-[1px] active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Post
                    </button>
                </div>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    <div className="p-4 sm:p-6 rounded-2xl bg-c-card border-t-4 border-t-c-accent border-l border-r border-b border-c-border shadow-sm flex flex-col justify-between">
                        <p className="text-xs text-c-muted font-bold uppercase tracking-wider">Total Posts</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-c-text mt-2"><CountUpNumber value={analytics.total_posts} /></p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl bg-c-card border border-c-border shadow-sm flex flex-col justify-between">
                        <p className="text-xs text-c-muted font-bold uppercase tracking-wider">Scheduled</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-c-text mt-2"><CountUpNumber value={analytics.scheduled_posts} /></p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl bg-c-card border border-c-border shadow-sm flex flex-col justify-between">
                        <p className="text-xs text-c-muted font-bold uppercase tracking-wider">Completed</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-c-text mt-2"><CountUpNumber value={analytics.posted_posts} /></p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl bg-c-card border border-c-border shadow-sm flex flex-col justify-between">
                        <p className="text-xs text-c-muted font-bold uppercase tracking-wider">Streak 🔥</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-c-text mt-2">
                            <CountUpNumber value={analytics.current_streak} />
                            <span className="text-xs sm:text-sm font-medium tracking-normal opacity-70 ml-1">days</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Goals */}
            <GoalSection />

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-c-border pb-4">
                <div className="flex space-x-1 bg-c-bg p-1 rounded-full border border-c-border w-full sm:w-auto">
                    {['all', 'upcoming', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 sm:flex-none px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all duration-300 ${filter === f
                                ? 'bg-c-card text-c-text shadow-sm border border-c-border'
                                : 'text-c-muted hover:text-c-text'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-c-muted font-semibold tracking-wide">Platform:</span>
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="w-full appearance-none rounded-full border border-c-border bg-c-card shadow-sm outline-none text-sm pl-4 pr-8 py-1.5 text-c-text font-medium transition cursor-pointer hover:border-c-accent"
                        >
                            <option value="All">All</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="X">X (Twitter)</option>
                            <option value="Facebook">Facebook</option>
                            <option value="General">General</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-c-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base sm:text-xl font-extrabold text-c-text flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5 text-c-accent" />
                        Templates
                    </h2>
                    <button
                        onClick={() => setShowTemplateModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-c-accent text-white hover:opacity-90 transition-all hover:-translate-y-[1px] shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Create Template</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 sm:py-14 rounded-2xl border border-dashed border-c-border bg-c-bg text-center gap-3 sm:gap-4">
                        <MascotOrb className="w-16 h-16 sm:w-20 sm:h-20" expression="think" />
                        <div>
                            <p className="font-bold text-c-text text-base sm:text-lg">No templates yet</p>
                            <p className="text-c-muted text-xs sm:text-sm mt-1">Save your best captions as reusable templates.</p>
                        </div>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-c-accent text-white hover:opacity-90 transition-all shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Create your first template
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {templates.map(template => (
                            <div key={template.id} className="post-card bg-c-card rounded-2xl border border-c-border p-4 sm:p-5 flex flex-col justify-between gap-3 group">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="p-1.5 rounded-lg bg-c-accent/10 text-c-accent flex-shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold text-c-text text-sm leading-tight line-clamp-1">{template.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => deleteTemplateMutation.mutate(template.id)}
                                            className="text-c-muted hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 -m-1"
                                            title="Delete template"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-c-muted line-clamp-3 leading-relaxed">{template.content}</p>
                                </div>
                                <button
                                    onClick={() => { setPostToEdit(null); setPrefillContent(template.content); setIsFormOpen(true); }}
                                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-c-bg border border-c-border text-c-text hover:border-c-accent hover:text-c-accent transition-all min-h-[36px]"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Use Template
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Template Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)}>
                    <div className="w-full max-w-md bg-c-card sm:rounded-3xl rounded-t-3xl shadow-2xl border border-c-border overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-c-border flex-shrink-0">
                            <h3 className="text-base sm:text-lg font-extrabold text-c-text flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-c-accent" />
                                New Template
                            </h3>
                            <button onClick={() => setShowTemplateModal(false)} className="btn btn-ghost btn-sm btn-circle">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-c-text mb-1.5">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Monday motivation post"
                                    value={newTemplate.title}
                                    onChange={e => setNewTemplate(t => ({ ...t, title: e.target.value }))}
                                    className="input input-bordered w-full rounded-xl text-c-text text-base"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-c-text mb-1.5">Content</label>
                                <textarea
                                    rows={5}
                                    placeholder="Write your template caption here..."
                                    value={newTemplate.content}
                                    onChange={e => setNewTemplate(t => ({ ...t, content: e.target.value }))}
                                    className="textarea textarea-bordered w-full rounded-xl text-c-text resize-none text-base"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                        </div>
                        <div className="px-5 pb-5 flex justify-end gap-3 flex-shrink-0">
                            <button onClick={() => setShowTemplateModal(false)} className="btn btn-ghost rounded-xl">Cancel</button>
                            <button
                                disabled={!newTemplate.title.trim() || !newTemplate.content.trim() || createTemplateMutation.isPending}
                                onClick={() => createTemplateMutation.mutate(newTemplate)}
                                className="btn bg-c-accent hover:opacity-90 text-white rounded-xl border-none"
                            >
                                {createTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Cards Grid */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => {
                    const pastDue = isPastDue(post);
                    return (
                        <div key={post.id} className="post-card bg-c-card rounded-2xl shadow-sm border border-c-border overflow-hidden hover:border-c-accent transition-colors">
                            <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'posted'
                                            ? 'bg-green-100 text-green-800'
                                            : pastDue
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-c-bg text-c-text border border-c-border'
                                            }`}>
                                            {post.status === 'posted' ? 'POSTED' : pastDue ? 'OVERDUE' : 'SCHEDULED'}
                                        </span>
                                        {post.platform && post.platform !== 'General' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-c-bg text-c-text shadow-sm border border-c-border">
                                                {PLATFORM_ICONS[post.platform] || PLATFORM_ICONS['General']}
                                                {post.platform}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {pastDue ? (
                                            <span title="Cannot edit: scheduled time has passed" className="text-c-muted/50 cursor-not-allowed p-1">
                                                <LockKeyhole className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => { setPostToEdit(post); setIsFormOpen(true); }}
                                                className="text-c-muted hover:text-c-accent transition p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                                                title="Edit post"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-c-muted hover:text-red-500 transition p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                                            title="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-c-text whitespace-pre-wrap line-clamp-4">{post.content}</p>
                                <div className={`mt-3 text-xs flex items-center gap-1 ${pastDue && post.status !== 'posted' ? 'text-red-500' : 'text-c-muted'}`}>
                                    {pastDue && post.status !== 'posted' && <span className="mr-0.5">⚠️</span>}
                                    {format(new Date(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                                </div>
                            </div>
                            {post.status === 'scheduled' && (
                                <div className="bg-c-bg px-4 sm:px-5 py-3 border-t border-c-border">
                                    <button
                                        onClick={() => markPostedMutation.mutate(post.id)}
                                        className="w-full inline-flex justify-center items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-c-accent hover:opacity-90 transition min-h-[36px]"
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
                    <div className="col-span-full py-12 text-center text-c-muted text-sm">
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
