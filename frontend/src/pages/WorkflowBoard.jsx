import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Globe } from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const STAGES = ['ideas', 'drafting', 'ready', 'scheduled', 'posted'];

const STAGE_META = {
    ideas: { label: '💡 Ideas', color: 'border-purple-400 dark:border-purple-500/50', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300', header: 'bg-purple-50 dark:bg-purple-900/20' },
    drafting: { label: '✏️ Drafting', color: 'border-amber-400 dark:border-amber-500/50', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300', header: 'bg-amber-50 dark:bg-amber-900/20' },
    ready: { label: '✅ Ready', color: 'border-emerald-400 dark:border-emerald-500/50', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300', header: 'bg-emerald-50 dark:bg-emerald-900/20' },
    scheduled: { label: '🕐 Scheduled', color: 'border-blue-400 dark:border-blue-500/50', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300', header: 'bg-blue-50 dark:bg-blue-900/20' },
    posted: { label: '🚀 Posted', color: 'border-green-500 dark:border-green-500/50', badge: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', header: 'bg-green-50 dark:bg-green-900/20' },
};

const PLATFORM_ICONS = {
    X: <FaXTwitter className="w-3.5 h-3.5" />,
    LinkedIn: <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />,
    Instagram: <FaInstagram className="w-3.5 h-3.5 text-[#E1306C]" />,
    Facebook: <FaFacebook className="w-3.5 h-3.5 text-[#1877F2]" />,
    General: <Globe className="w-3.5 h-3.5 text-c-muted" />,
};

const WorkflowBoard = () => {
    const queryClient = useQueryClient();
    const [draggingId, setDraggingId] = useState(null);
    const dragOverStage = useRef(null);

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['posts-workflow'],
        queryFn: async () => {
            const res = await api.get('posts/');
            return res.data;
        }
    });

    const updateStageMutation = useMutation({
        mutationFn: async ({ id, workflow_stage }) => {
            await api.patch(`posts/${id}/update-stage/`, { workflow_stage });
        },
        onMutate: async ({ id, workflow_stage }) => {
            await queryClient.cancelQueries({ queryKey: ['posts-workflow'] });
            const prev = queryClient.getQueryData(['posts-workflow']);
            queryClient.setQueryData(['posts-workflow'], old =>
                old.map(p => p.id === id ? { ...p, workflow_stage } : p)
            );
            return { prev };
        },
        onError: (_, __, ctx) => {
            queryClient.setQueryData(['posts-workflow'], ctx.prev);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts-workflow'] });
        }
    });

    const handleDragStart = (e, post) => {
        setDraggingId(post.id);
        e.dataTransfer.setData('postId', String(post.id));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => setDraggingId(null);

    const handleDrop = (e, stage) => {
        e.preventDefault();
        const postId = parseInt(e.dataTransfer.getData('postId'), 10);
        if (!postId) return;
        const post = posts.find(p => p.id === postId);
        if (post && post.workflow_stage !== stage) {
            updateStageMutation.mutate({ id: postId, workflow_stage: stage });
        }
        dragOverStage.current = null;
    };

    const postsByStage = (stage) => posts.filter(p => p.workflow_stage === stage);

    if (isLoading) return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
            {STAGES.map(s => (
                <div key={s} className="h-96 bg-c-card rounded-2xl border border-c-border" />
            ))}
        </div>
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-c-text">Workflow Board</h1>
                    <p className="text-sm text-c-muted mt-0.5">Drag cards between stages to move your content through the pipeline.</p>
                </div>
                <div className="text-xs text-c-muted bg-c-card border border-c-border px-3 py-2 rounded-xl">
                    {posts.length} total posts
                </div>
            </div>

            {/* Board — horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-3 sm:gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
                    {STAGES.map(stage => {
                        const meta = STAGE_META[stage];
                        const stagePosts = postsByStage(stage);
                        return (
                            <div
                                key={stage}
                                onDragOver={e => { e.preventDefault(); dragOverStage.current = stage; }}
                                onDrop={e => handleDrop(e, stage)}
                                className={`w-64 sm:w-auto flex flex-col rounded-2xl border-2 bg-c-card overflow-hidden transition-all ${meta.color}`}
                                style={{ minHeight: 400 }}
                            >
                                {/* Column header */}
                                <div className={`px-3 py-3 border-b border-c-border flex items-center justify-between ${meta.header}`}>
                                    <span className="font-bold text-xs sm:text-sm text-c-text">{meta.label}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>{stagePosts.length}</span>
                                </div>

                                {/* Cards */}
                                <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto">
                                    {stagePosts.map(post => (
                                        <motion.div
                                            key={post.id}
                                            layout
                                            draggable
                                            onDragStart={e => handleDragStart(e, post)}
                                            onDragEnd={handleDragEnd}
                                            className={`bg-c-bg rounded-xl border border-c-border p-3 cursor-grab hover:-translate-y-0.5 hover:shadow-md transition-all select-none ${draggingId === post.id ? 'opacity-40 scale-95' : ''}`}
                                        >
                                            {/* Platform + status row */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-c-muted">
                                                    {PLATFORM_ICONS[post.platform] || PLATFORM_ICONS.General}
                                                    {post.platform}
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${post.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-c-border text-c-muted'}`}>
                                                    {post.status.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Caption preview */}
                                            <p className="text-xs text-c-text line-clamp-3 leading-relaxed mb-2">
                                                {post.content}
                                            </p>

                                            {/* Scheduled time */}
                                            <div className="text-[10px] text-c-muted border-t border-c-border pt-1.5 mt-1">
                                                {format(new Date(post.scheduled_time), "MMM d, h:mm a")}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {stagePosts.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-24 text-c-muted/40 text-xs text-center gap-1">
                                            <span className="text-2xl">+</span>
                                            Drop here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WorkflowBoard;
