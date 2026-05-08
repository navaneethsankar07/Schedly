import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Calendar, LayoutDashboard, LayoutTemplate, Bell, User,
    Columns2, BarChart2, Search, ArrowRight
} from 'lucide-react';

const COMMANDS = [
    { id: 'create-post', label: 'Create New Post', icon: <Plus className="w-4 h-4" />, desc: 'Schedule a new social media post', action: 'modal', path: '/dashboard' },
    { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, desc: 'View your post workspace', action: 'navigate', path: '/dashboard' },
    { id: 'calendar', label: 'Open Calendar', icon: <Calendar className="w-4 h-4" />, desc: 'See your posting schedule', action: 'navigate', path: '/calendar' },
    { id: 'workflow', label: 'Open Workflow Board', icon: <Columns2 className="w-4 h-4" />, desc: 'Manage your Kanban content pipeline', action: 'navigate', path: '/workflow' },
    { id: 'reports', label: 'Open Reports', icon: <BarChart2 className="w-4 h-4" />, desc: 'View your weekly productivity report', action: 'navigate', path: '/reports' },
    { id: 'notifications', label: 'Open Notifications', icon: <Bell className="w-4 h-4" />, desc: 'Check your alerts', action: 'navigate', path: '/notifications' },
    { id: 'profile', label: 'Open Profile', icon: <User className="w-4 h-4" />, desc: 'Manage account settings', action: 'navigate', path: '/profile' },
];

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const filtered = COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase())
    );

    const execute = useCallback((cmd) => {
        setIsOpen(false);
        setQuery('');
        navigate(cmd.path);
    }, [navigate]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setQuery('');
                setSelected(0);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        setSelected(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
        if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-end sm:items-start justify-center sm:pt-24 p-0 sm:px-4"
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="w-full sm:max-w-xl bg-c-card sm:rounded-2xl rounded-t-2xl border border-c-border shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search bar */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-c-border">
                            <Search className="w-4 h-4 text-c-muted flex-shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search commands..."
                                className="flex-1 bg-transparent text-c-text placeholder-c-muted text-sm sm:text-base outline-none"
                                style={{ fontSize: '16px' }}
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-c-bg rounded text-xs text-c-muted border border-c-border font-mono">
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-72 sm:max-h-80 overflow-y-auto py-1.5">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-8 text-center text-c-muted text-sm">No commands found.</div>
                            ) : (
                                filtered.map((cmd, i) => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => execute(cmd)}
                                        onMouseEnter={() => setSelected(i)}
                                        className={`w-full flex items-center gap-3.5 px-4 py-3 text-left transition-colors ${i === selected ? 'bg-c-accent/10 text-c-accent' : 'text-c-text hover:bg-c-bg'}`}
                                    >
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${i === selected ? 'bg-c-accent/20 text-c-accent' : 'bg-c-bg text-c-muted'}`}>
                                            {cmd.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{cmd.label}</p>
                                            <p className="text-xs text-c-muted truncate">{cmd.desc}</p>
                                        </div>
                                        {i === selected && <ArrowRight className="w-4 h-4 flex-shrink-0 text-c-accent" />}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-4 py-2.5 border-t border-c-border flex items-center gap-4 text-xs text-c-muted bg-c-bg">
                            <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
                            <span><kbd className="font-mono">↵</kbd> Open</span>
                            <span><kbd className="font-mono">Esc</kbd> Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
