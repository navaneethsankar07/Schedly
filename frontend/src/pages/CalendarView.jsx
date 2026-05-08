import React, { useState } from 'react';
import api from '../services/api';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
    const queryClient = useQueryClient();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const { data: posts = [] } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await api.get('posts/');
            return res.data;
        }
    });

    const handleDragStart = (e, post) => {
        e.dataTransfer.setData('post', JSON.stringify(post));
    };

    const updatePostMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            await api.put(`posts/${id}/`, payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
    });

    const handleDrop = (e, droppedDate) => {
        e.preventDefault();
        try {
            const postObjStr = e.dataTransfer.getData('post');
            if (!postObjStr) return;
            const post = JSON.parse(postObjStr);
            const oldDateObj = new Date(post.scheduled_time);
            const newDateObj = new Date(droppedDate);
            newDateObj.setHours(oldDateObj.getHours());
            newDateObj.setMinutes(oldDateObj.getMinutes());
            newDateObj.setSeconds(oldDateObj.getSeconds());
            updatePostMutation.mutate({
                id: post.id,
                payload: { content: post.content, platform: post.platform, scheduled_time: newDateObj.toISOString() }
            });
        } catch (err) { console.error("Drop failed:", err); }
    };

    const prevMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };
    const nextMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Compute leading empty days so first day of month aligns to correct weekday column
    const firstDayOfWeek = startOfMonth(currentDate).getDay(); // 0=Sun

    const getPostsForDay = (day) => posts.filter(p => isSameDay(new Date(p.scheduled_time), day));
    const selectedPosts = selectedDate ? getPostsForDay(selectedDate) : [];

    return (
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
            {/* Calendar Grid */}
            <div className="flex-1 bg-c-card p-4 sm:p-6 rounded-xl shadow-sm border border-c-border min-w-0">
                {/* Month header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-xl font-bold text-c-text">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="flex gap-1.5">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg border border-c-border hover:bg-c-bg transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg border border-c-border hover:bg-c-bg transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Next month"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable calendar on small screens */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="min-w-[320px] px-4 sm:px-0">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-px mb-px">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="bg-c-bg text-center text-[10px] sm:text-xs font-semibold text-c-muted py-2 uppercase tracking-wider rounded-t">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-px bg-c-border rounded-b-lg overflow-hidden border border-c-border">
                            {/* Leading empty slots */}
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-c-bg min-h-[52px] sm:min-h-[80px]" />
                            ))}

                            {daysInMonth.map(day => {
                                const dayPosts = getPostsForDay(day);
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => setSelectedDate(day)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, day)}
                                        className={`min-h-[52px] sm:min-h-[80px] bg-c-card p-1 sm:p-2 cursor-pointer hover:bg-c-accent/5 transition-colors ${isSelected ? 'ring-2 ring-c-accent ring-inset bg-c-accent/5' : ''}`}
                                    >
                                        <div className={`text-xs sm:text-sm font-medium mb-1 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-c-accent text-white' : 'text-c-text/80'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        <div className="space-y-0.5">
                                            {dayPosts.slice(0, 2).map(post => (
                                                <div
                                                    key={post.id}
                                                    draggable={true}
                                                    onDragStart={(e) => handleDragStart(e, post)}
                                                    className={`text-[9px] sm:text-xs px-1 py-0.5 rounded truncate cursor-move ${post.status === 'posted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                >
                                                    {format(new Date(post.scheduled_time), 'HH:mm')}
                                                </div>
                                            ))}
                                            {dayPosts.length > 2 && (
                                                <div className="text-[9px] sm:text-xs text-c-muted px-1">+{dayPosts.length - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Day Detail Panel */}
            <div className="w-full lg:w-80 xl:w-96">
                <div className="bg-c-card p-4 sm:p-6 rounded-xl shadow-sm border border-c-border">
                    <h3 className="text-base sm:text-lg font-bold text-c-text mb-4">
                        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                    </h3>
                    {!selectedDate && (
                        <p className="text-c-muted text-sm">Click any day on the calendar to see its posts.</p>
                    )}
                    {selectedDate && selectedPosts.length === 0 && (
                        <p className="text-c-muted text-sm">No posts scheduled for this day.</p>
                    )}
                    <div className="space-y-3 mt-2">
                        {selectedPosts.map(post => (
                            <div key={post.id} className="p-3 sm:p-4 border border-c-border bg-c-bg rounded-lg">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2 ${post.status === 'posted'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    {post.status.toUpperCase()}
                                </span>
                                <p className="text-sm text-c-text line-clamp-3 mb-2">{post.content}</p>
                                <div className="text-xs text-c-muted">{format(new Date(post.scheduled_time), 'h:mm a')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
