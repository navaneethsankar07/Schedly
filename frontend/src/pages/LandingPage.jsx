import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, LayoutDashboard, Share2, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MascotOrb from '../components/MascotOrb';
import SchedlyLogo from '../components/SchedlyLogo';

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
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative bg-[#09090b] overflow-hidden text-neutral-100">
            {/* Ambient Animated Particles Background for Landing Room */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen float-slow"></div>
                <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px] mix-blend-screen float-delayed"></div>

                {/* Floating SVGs */}
                <Sparkles className="absolute top-1/4 left-1/4 text-white/10 w-12 h-12 floating-orb" />
                <Calendar className="absolute top-1/3 right-1/4 text-white/10 w-16 h-16 float-slow" />
                <Share2 className="absolute bottom-1/3 left-1/3 text-white/10 w-20 h-20 float-delayed" />
            </div>

            {/* Navigation */}
            <nav className="backdrop-blur-md sticky top-0 z-50 border-b border-white/10 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <SchedlyLogo size="md" className="text-white" />
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="btn border-0 text-white rounded-full px-6 shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 hover:scale-105 transition-all font-bold"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-ghost rounded-full text-white/80 hover:text-white">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn border-0 text-white rounded-full px-6 shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 hover:scale-105 transition-all font-bold"
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
            <main className="flex-grow z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-semibold mb-8 shadow-inner backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>Say hello to your intelligent assistant</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                                Plan smarter.<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 neon-text-glow">Post better.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed max-w-lg font-medium">
                                Plan, organize, and track your content in one beautiful space. Let Nova handle your schedule while you build your audience.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] transition-all"
                                >
                                    Start Scheduling
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-base font-bold rounded-full text-white hover:bg-white/10 hover:scale-[1.02] transition-all backdrop-blur-sm"
                                >
                                    Meet Nova
                                </a>
                            </div>
                        </motion.div>

                        {/* Right: Character Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative flex justify-center items-center h-[500px]"
                        >
                            {/* Floating elements behind mascot */}
                            <div className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-tr from-cyan-400 to-emerald-500 rounded-2xl rotate-12 floating-orb opacity-60 blur-[1px]"></div>
                            <div className="absolute bottom-[20%] right-[10%] w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full float-delayed opacity-50 blur-[2px]"></div>

                            {/* Main Mascot */}
                            <div className="relative z-10 floating-orb">
                                <MascotOrb className="w-[300px] h-[300px]" expression="smile" />
                            </div>

                            {/* Glass Card Floating Notification */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="absolute bottom-1/4 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl glass-card flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Post Scheduled!</p>
                                    <p className="text-xs text-white/60">Going live at 12:00 PM</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="bg-black/40 py-24 border-t border-white/5 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Everything you need to succeed</h2>
                            <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-medium">We've stripped away the complexity to give you exactly what matters.</p>
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
                                    icon: <LayoutDashboard className="w-7 h-7 text-cyan-400" />,
                                    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/20",
                                    title: "Smart Dashboard",
                                    desc: "Create and track all your scheduled posts in one intuitive interface. Filter between upcoming and completed posts effortlessly.",
                                },
                                {
                                    icon: <Calendar className="w-7 h-7 text-emerald-400" />,
                                    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
                                    title: "Visual Calendar",
                                    desc: "Get a bird's-eye view of your entire month. Spot content gaps and maintain consistency with our drag-and-drop calendar.",
                                },
                                {
                                    icon: <CheckCircle className="w-7 h-7 text-teal-400" />,
                                    color: "from-teal-500/20 to-cyan-500/10 border-teal-500/20",
                                    title: "AI Caption Assist",
                                    desc: "Let Nova's smart caption engine enhance your copy — auto-add hashtags, emojis, and formatting for each platform.",
                                }
                            ].map((ft, i) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={i}
                                    className={`bg-gradient-to-br ${ft.color} backdrop-blur-sm p-8 rounded-3xl border hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-900/30 transition-all duration-300`}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm border border-white/10">
                                        {ft.icon}
                                    </div>
                                    <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">{ft.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed font-medium">{ft.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <SchedlyLogo size="lg" className="text-white" />
                    </div>
                    <p className="text-neutral-500 text-sm font-medium">© 2026 Social Media Scheduler — Built for creators, by creators.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
