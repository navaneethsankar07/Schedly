import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, Share2, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                                Scheduler
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm shadow-indigo-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm shadow-indigo-200"
                                    >
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
                                <Sparkles className="w-4 h-4" />
                                <span>The modern way to manage content</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                                Automate your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">Social Pipeline</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                                Plan, organize, and track your content in one beautiful space. Stop stressing over missing posts and start growing your audience effortlessly.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="inline-flex justify-center items-center gap-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Start Scheduling
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex justify-center items-center gap-2 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-8 py-4 rounded-full transition-all duration-300"
                                >
                                    View Features
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="bg-gray-50 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">We've stripped away the complexity to give you exactly what matters most for a consistent posting routine.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <LayoutDashboard className="w-6 h-6 text-indigo-600" />,
                                    title: "Smart Dashboard",
                                    desc: "Create and track all your scheduled posts in one intuitive interface. Filter between upcoming and completed posts effortlessly.",
                                    color: "bg-indigo-50 border-indigo-100"
                                },
                                {
                                    icon: <Calendar className="w-6 h-6 text-violet-600" />,
                                    title: "Visual Calendar",
                                    desc: "Get a bird's-eye view of your entire month. Our custom visual grid helps you spot content gaps and maintain consistency.",
                                    color: "bg-violet-50 border-violet-100"
                                },
                                {
                                    icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
                                    title: "Status Tracking",
                                    desc: "Keep tabs on what's live and what's pending. Dynamic colored badges ensure you never miss a scheduled release.",
                                    color: "bg-emerald-50 border-emerald-100"
                                }
                            ].map((ft, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${ft.color}`}>
                                        {ft.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{ft.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{ft.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Share2 className="w-5 h-5 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">Scheduler</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2026 Social Media Scheduler. Crafted with care.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
