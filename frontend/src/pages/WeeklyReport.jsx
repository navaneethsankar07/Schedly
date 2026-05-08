import React from 'react';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart2, Zap, TrendingUp, Clock, Award, Flame, Lightbulb } from 'lucide-react';

const StatCard = ({ icon, label, value, sub, accent }) => (
    <div className="bg-c-card rounded-2xl border border-c-border p-4 sm:p-5 flex items-start gap-4 hover:border-c-accent transition-colors hover:-translate-y-0.5">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${accent || 'bg-c-accent/10 text-c-accent'}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-c-muted font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-xl sm:text-2xl font-extrabold text-c-text mt-0.5">{value}</p>
            {sub && <p className="text-xs text-c-muted mt-0.5">{sub}</p>}
        </div>
    </div>
);

const ScoreRing = ({ score }) => {
    const r = 48;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="-rotate-90 w-full h-full">
                    <circle cx="56" cy="56" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-c-border" />
                    <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-c-text">{score}</span>
                    <span className="text-[10px] text-c-muted font-medium">/ 100</span>
                </div>
            </div>
            <p className="text-sm font-semibold text-c-text mt-2">Productivity Score</p>
            <p className="text-xs text-c-muted">This week</p>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-c-card border border-c-border rounded-xl px-3 py-2 shadow-lg text-xs">
                <p className="font-bold text-c-text">{label}</p>
                <p className="text-c-accent">{payload[0].value} posts</p>
            </div>
        );
    }
    return null;
};

const WeeklyReport = () => {
    const { data: report, isLoading, isError } = useQuery({
        queryKey: ['weekly-report'],
        queryFn: async () => {
            const res = await api.get('reports/weekly/');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-c-bg rounded-xl" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-c-bg rounded-2xl" />)}
            </div>
            <div className="h-64 bg-c-bg rounded-2xl" />
        </div>
    );

    if (isError || !report) return (
        <div className="text-center py-16 text-c-muted">
            <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Could not load report</p>
        </div>
    );

    return (
        <div className="space-y-5 sm:space-y-7">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-c-text flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-c-accent" />
                        Weekly Report
                    </h1>
                    <p className="text-sm text-c-muted mt-0.5">Your productivity summary for the last 7 days.</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Posts Created"
                    value={report.total_posts}
                    sub="This week"
                />
                <StatCard
                    icon={<Zap className="w-5 h-5" />}
                    label="Posts Published"
                    value={report.posted_count}
                    accent="bg-blue-100 text-blue-600"
                />
                <StatCard
                    icon={<Flame className="w-5 h-5" />}
                    label="Current Streak"
                    value={`${report.streak}d`}
                    accent="bg-orange-100 text-orange-600"
                    sub="consecutive days"
                />
                <StatCard
                    icon={<Award className="w-5 h-5" />}
                    label="Top Platform"
                    value={report.top_platform}
                    accent="bg-purple-100 text-purple-600"
                    sub={`Most active: ${report.most_active_day}`}
                />
            </div>

            {/* Charts + Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Area chart — takes 2/3 width on desktop */}
                <div className="lg:col-span-2 bg-c-card rounded-2xl border border-c-border p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-c-text mb-4">Posts per Day</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={report.daily_breakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="postGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--c-accent-raw, #10b981)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--c-accent-raw, #10b981)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border-raw, #e2e8f0)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--c-muted-raw, #94a3b8)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--c-muted-raw, #94a3b8)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="posts" stroke="#10b981" strokeWidth={2.5} fill="url(#postGrad)" dot={{ fill: '#10b981', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Productivity score ring */}
                <div className="bg-c-card rounded-2xl border border-c-border p-4 sm:p-5 flex items-center justify-center">
                    <ScoreRing score={report.productivity_score} />
                </div>
            </div>

            {/* Bar chart */}
            <div className="bg-c-card rounded-2xl border border-c-border p-4 sm:p-5">
                <h3 className="text-sm font-bold text-c-text mb-4">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={report.daily_breakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border-raw, #e2e8f0)" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--c-muted-raw, #94a3b8)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--c-muted-raw, #94a3b8)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="posts" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="bg-c-card rounded-2xl border border-c-border p-4 sm:p-5">
                <h3 className="text-sm font-bold text-c-text mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Weekly Insights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-c-bg border border-c-border">
                            <Clock className="w-4 h-4 text-c-accent flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-c-text">{insight}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyReport;
