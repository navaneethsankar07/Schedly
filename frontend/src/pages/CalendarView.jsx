import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';

const CalendarView = () => {
    const [posts, setPosts] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('posts/');
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, []);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const getPostsForDay = (day) => {
        return posts.filter((post) => isSameDay(new Date(post.scheduled_time), day));
    };

    const selectedPosts = selectedDate ? getPostsForDay(selectedDate) : [];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-base-content">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="px-3 py-1 border border-base-content/20 rounded hover:bg-base-200 transition"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="px-3 py-1 border border-base-content/20 rounded hover:bg-base-200 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-base-300">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-base-200 text-center text-xs font-semibold text-base-content/60 py-3 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                    {/* Padding for first day of month could go here based on date-fns dayOfWeek, simplifying for demo */}
                    {daysInMonth.map(day => {
                        const dayPosts = getPostsForDay(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`min-h-[100px] bg-base-100 p-2 cursor-pointer hover:bg-emerald-50 transition ${isSelected ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50' : ''
                                    }`}
                            >
                                <div className="font-medium text-sm text-base-content/80 mb-1">{format(day, 'd')}</div>
                                <div className="space-y-1">
                                    {dayPosts.map(post => (
                                        <div
                                            key={post.id}
                                            className={`text-xs px-1.5 py-0.5 rounded truncate ${post.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {format(new Date(post.scheduled_time), 'HH:mm')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-full lg:w-96">
                <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
                    <h3 className="text-lg font-bold text-base-content mb-4">
                        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                    </h3>
                    {selectedDate && selectedPosts.length === 0 && (
                        <p className="text-base-content/60 text-sm">No posts scheduled for this day.</p>
                    )}
                    <div className="space-y-4">
                        {selectedPosts.map(post => (
                            <div key={post.id} className="p-4 border border-base-200 bg-base-200 rounded-lg">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2 ${post.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {post.status.toUpperCase()}
                                </span>
                                <p className="text-sm text-base-content line-clamp-3 mb-2">{post.content}</p>
                                <div className="text-xs text-base-content/60">
                                    {format(new Date(post.scheduled_time), 'h:mm a')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
