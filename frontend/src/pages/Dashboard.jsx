import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostForm from '../components/PostForm';
import { Pencil, Trash2, CheckCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);

    const fetchPosts = async () => {
        try {
            const res = await api.get('posts/');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await api.delete(`posts/${id}/`);
            fetchPosts();
        }
    };

    const markPosted = async (id) => {
        await api.patch(`posts/${id}/mark-posted/`);
        fetchPosts();
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'upcoming') return post.status === 'scheduled';
        if (filter === 'completed') return post.status === 'posted';
        return true;
    }).sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button
                    onClick={() => { setPostToEdit(null); setIsFormOpen(true); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                </button>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 pb-2">
                {['all', 'upcoming', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {post.status.toUpperCase()}
                                </span>
                                <div className="flex space-x-2">
                                    <button onClick={() => { setPostToEdit(post); setIsFormOpen(true); }} className="text-gray-400 hover:text-indigo-600 transition">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="text-gray-400 hover:text-red-600 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-900 whitespace-pre-wrap line-clamp-4">{post.content}</p>
                            <div className="mt-4 text-xs text-gray-500 flex items-center">
                                {format(new Date(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                        </div>
                        {post.status === 'scheduled' && (
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                                <button
                                    onClick={() => markPosted(post.id)}
                                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition"
                                >
                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                    Mark as Posted
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No posts found.
                    </div>
                )}
            </div>

            <PostForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                fetchPosts={fetchPosts}
                postToEdit={postToEdit}
            />
        </div>
    );
};

export default Dashboard;
