import React, { useState } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Plus, X, Edit2, Check, Loader2 } from 'lucide-react';

const motivationalMessages = (pct) => {
    if (pct >= 100) return { text: "Goal crushed! You're amazing! 🎉", color: 'text-emerald-600' };
    if (pct >= 80) return { text: "Almost there — keep going! 🔥", color: 'text-amber-600' };
    if (pct >= 50) return { text: "Halfway through, stay consistent! 💪", color: 'text-blue-600' };
    if (pct >= 20) return { text: "Good start, build up the momentum! ✨", color: 'text-purple-600' };
    return { text: "Let's get started — every post counts! 🚀", color: 'text-c-muted' };
};

const ProgressRing = ({ pct, size = 80, color = '#10b981' }) => {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-c-border" />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
        </svg>
    );
};

const GoalSection = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ target_posts: 5, timeframe: 'weekly' });

    const { data: goals = [], isLoading } = useQuery({
        queryKey: ['goals'],
        queryFn: async () => {
            const res = await api.get('goals/');
            return res.data;
        }
    });

    const createGoal = useMutation({
        mutationFn: (data) => api.post('goals/', data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); setShowModal(false); }
    });

    const updateGoal = useMutation({
        mutationFn: ({ id, data }) => api.put(`goals/${id}/`, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); setEditingId(null); }
    });

    const deleteGoal = useMutation({
        mutationFn: (id) => api.delete(`goals/${id}/`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
    });

    const handleSubmit = () => {
        if (editingId) {
            updateGoal.mutate({ id: editingId, data: form });
        } else {
            createGoal.mutate(form);
        }
    };

    const openEdit = (goal) => {
        setForm({ target_posts: goal.target_posts, timeframe: goal.timeframe });
        setEditingId(goal.id);
        setShowModal(true);
    };

    const openCreate = () => {
        setForm({ target_posts: 5, timeframe: 'weekly' });
        setEditingId(null);
        setShowModal(true);
    };

    if (isLoading) return (
        <div className="space-y-4">
            <div className="h-6 w-32 bg-c-bg rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-c-bg rounded-2xl animate-pulse" />)}
            </div>
        </div>
    );

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-xl font-extrabold text-c-text flex items-center gap-2">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-c-accent" />
                        Posting Goals
                    </h2>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-c-accent text-white hover:opacity-90 transition-all hover:-translate-y-[1px]"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add Goal</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>

                {/* Goal Cards */}
                {goals.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl border border-dashed border-c-border bg-c-bg text-c-muted">
                        <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-sm">No goals yet</p>
                        <p className="text-xs mt-1">Set a weekly or monthly posting target to stay on track.</p>
                        <button onClick={openCreate} className="mt-4 px-4 py-2 bg-c-accent text-white rounded-full text-sm font-bold hover:opacity-90 transition">
                            Create First Goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {goals.map(goal => {
                            const { text, color } = motivationalMessages(goal.progress_pct);
                            const ringColor = goal.progress_pct >= 100 ? '#10b981' : goal.progress_pct >= 50 ? '#3b82f6' : '#f59e0b';
                            return (
                                <div key={goal.id} className="bg-c-card rounded-2xl border border-c-border p-4 sm:p-5 flex items-start gap-4 group hover:border-c-accent transition-colors relative">
                                    {/* Ring */}
                                    <div className="relative flex-shrink-0">
                                        <ProgressRing pct={goal.progress_pct} size={72} color={ringColor} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs font-bold text-c-text">{goal.progress_pct}%</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-c-text text-sm capitalize">{goal.timeframe} Goal</p>
                                                <p className="text-xs text-c-muted">{goal.progress_count} / {goal.target_posts} posts</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-c-bg text-c-muted hover:text-c-accent transition min-w-[28px] min-h-[28px]"><Edit2 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => deleteGoal.mutate(goal.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-c-muted hover:text-red-500 transition min-w-[28px] min-h-[28px]"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                        <p className={`text-xs mt-2 font-medium ${color}`}>{text}</p>

                                        {/* Progress bar */}
                                        <div className="mt-3 h-1.5 bg-c-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${goal.progress_pct}%`, backgroundColor: ringColor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-sm bg-c-card sm:rounded-2xl rounded-t-2xl border border-c-border shadow-2xl p-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-extrabold text-c-text flex items-center gap-2">
                                <Target className="w-4 h-4 text-c-accent" />
                                {editingId ? 'Edit Goal' : 'New Goal'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-c-bg text-c-muted min-w-[28px] min-h-[28px]"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-c-muted mb-1.5 block">Timeframe</label>
                                <div className="flex gap-2">
                                    {['weekly', 'monthly'].map(tf => (
                                        <button
                                            key={tf}
                                            onClick={() => setForm(f => ({ ...f, timeframe: tf }))}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize border transition min-h-[44px] ${form.timeframe === tf ? 'bg-c-accent text-white border-c-accent' : 'bg-c-bg text-c-muted border-c-border hover:border-c-accent'}`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-c-muted mb-1.5 block">Target Posts</label>
                                <input
                                    type="number" min="1" max="100"
                                    value={form.target_posts}
                                    onChange={e => setForm(f => ({ ...f, target_posts: parseInt(e.target.value) || 1 }))}
                                    className="w-full rounded-xl border border-c-border bg-c-bg text-c-text p-3 text-sm outline-none focus:border-c-accent"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={createGoal.isPending || updateGoal.isPending}
                                className="w-full py-3 rounded-xl bg-c-accent text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 min-h-[44px]"
                            >
                                {(createGoal.isPending || updateGoal.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {editingId ? 'Update Goal' : 'Create Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoalSection;
