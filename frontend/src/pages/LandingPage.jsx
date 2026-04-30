import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, Share2, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col font-sans transition-colors duration-300">
            {/* Navigation */}
            <nav className="bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-lg text-primary-content">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Scheduler
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-ghost rounded-full">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
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
                <div className="relative overflow-hidden bg-base-100">
                    <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(var(--fallback-b3,oklch(var(--b3)))_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                                <Sparkles className="w-4 h-4" />
                                <span>The modern way to manage content</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-base-content tracking-tight leading-tight mb-6">
                                Automate your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Social Pipeline</span>
                            </h1>
                            <p className="text-lg md:text-xl text-base-content/70 mb-10 leading-relaxed">
                                Plan, organize, and track your content in one beautiful space. Stop stressing over missing posts and start growing your audience effortlessly.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                                >
                                    Start Scheduling
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Link>
                                <a
                                    href="#features"
                                    className="btn btn-outline btn-lg rounded-full px-8 hover:scale-[1.02] transition-transform"
                                >
                                    View Features
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="bg-base-200 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-base-content mb-4">Everything you need to succeed</h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">We've stripped away the complexity to give you exactly what matters most for a consistent posting routine.</p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {[
                                {
                                    icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
                                    title: "Smart Dashboard",
                                    desc: "Create and track all your scheduled posts in one intuitive interface. Filter between upcoming and completed posts effortlessly.",
                                },
                                {
                                    icon: <Calendar className="w-6 h-6 text-secondary" />,
                                    title: "Visual Calendar",
                                    desc: "Get a bird's-eye view of your entire month. Our custom visual grid helps you spot content gaps and maintain consistency.",
                                },
                                {
                                    icon: <CheckCircle className="w-6 h-6 text-accent" />,
                                    title: "Status Tracking",
                                    desc: "Keep tabs on what's live and what's pending. Dynamic status updates ensure you never miss a scheduled release.",
                                }
                            ].map((ft, i) => (
                                <motion.div variants={itemVariants} key={i} className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-base-200">
                                        {ft.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content mb-3">{ft.title}</h3>
                                    <p className="text-base-content/70 leading-relaxed">{ft.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-base-100 border-t border-base-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Share2 className="w-5 h-5 text-primary" />
                        <span className="text-xl font-bold text-base-content">Scheduler</span>
                    </div>
                    <p className="text-base-content/50 text-sm">© 2026 Social Media Scheduler. Crafted with care.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
