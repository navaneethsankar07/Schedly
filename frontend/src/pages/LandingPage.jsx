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
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative bg-[#09090b] overflow-x-hidden text-neutral-100">
            {/* Ambient Animated Particles Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[10%] left-[-10%] sm:left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/20 rounded-full blur-[80px] sm:blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute top-[30%] right-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-600/20 rounded-full blur-[70px] sm:blur-[100px] mix-blend-screen float-slow"></div>
                <div className="absolute bottom-[-5%] left-[20%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-teal-600/20 rounded-full blur-[100px] sm:blur-[120px] mix-blend-screen float-delayed"></div>

                {/* Floating Icons */}
                <Sparkles className="absolute top-1/4 left-1/4 text-white/10 w-8 h-8 sm:w-12 sm:h-12 floating-orb hidden sm:block" />
                <Calendar className="absolute top-1/3 right-1/4 text-white/10 w-12 h-12 sm:w-16 sm:h-16 float-slow hidden sm:block" />
                <Share2 className="absolute bottom-1/3 left-1/3 text-white/10 w-16 h-16 sm:w-20 sm:h-20 float-delayed hidden sm:block" />
            </div>

            {/* Navigation */}
            <nav className="backdrop-blur-md sticky top-0 z-50 border-b border-white/10 bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <SchedlyLogo size="md" className="text-white hover:scale-105 transition-transform" />
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 text-sm sm:text-base"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-white/80 hover:text-white font-semibold transition-colors text-sm sm:text-base px-2">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 text-sm sm:text-base"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pt-24 sm:pb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-semibold mb-8 shadow-inner backdrop-blur-sm mx-auto lg:mx-0">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>Say hello to Nova, your AI planner</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                                Your Content,<br className="hidden sm:block" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Perfectly Timed.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                                Schedly helps you plan, organize, and automate your social media presence. Beautifully simple, yet incredibly powerful.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.05] transition-all"
                                >
                                    Start Free Today
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-base font-bold rounded-full text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
                                >
                                    Explore Features
                                </a>
                            </div>
                        </motion.div>

                        {/* Right: Mascot Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative flex justify-center items-center h-[350px] sm:h-[500px]"
                        >
                            {/* Decorative Blobs */}
                            <div className="absolute top-[10%] left-[20%] w-24 h-24 bg-gradient-to-tr from-cyan-400 to-emerald-500 rounded-3xl rotate-12 floating-orb opacity-40 blur-[2px]"></div>
                            <div className="absolute bottom-[10%] right-[20%] w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full float-delayed opacity-30 blur-[4px]"></div>

                            {/* Main Mascot */}
                            <div className="relative z-10 floating-orb drop-shadow-2xl">
                                <MascotOrb className="w-[200px] sm:w-[350px] h-[200px] sm:h-[350px]" expression="smile" />
                            </div>

                            {/* Floating Glass UI Element */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute bottom-4 sm:bottom-10 -right-4 sm:-right-8 bg-black/40 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[240px]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Post Optimized!</p>
                                    <p className="text-xs text-white/50">Engagement score: 98%</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 sm:gap-24 opacity-40 grayscale contrast-125">
                        <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">INSTAGRAM</div>
                        <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">TIKTOK</div>
                        <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">TWITTER</div>
                        <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">LINKEDIN</div>
                    </div>
                </div>

                {/* Features Section */}
                <section id="features" className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Supercharge your workflow</h2>
                            <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-medium">All the tools you need to grow your social presence without the burnout.</p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[
                                {
                                    icon: <LayoutDashboard className="w-8 h-8 text-cyan-400" />,
                                    color: "from-cyan-500/10 to-transparent border-cyan-500/20",
                                    title: "Kanban Planning",
                                    desc: "Organize your ideas into states: Icebox, In Progress, Scheduled, and Published. Never lose a thought again.",
                                },
                                {
                                    icon: <Calendar className="w-8 h-8 text-emerald-400" />,
                                    color: "from-emerald-500/10 to-transparent border-emerald-500/20",
                                    title: "Interactive Calendar",
                                    desc: "Visualize your content strategy with our drag-and-drop calendar. Easily spot gaps in your posting schedule.",
                                },
                                {
                                    icon: <Sparkles className="w-8 h-8 text-teal-400" />,
                                    color: "from-teal-500/10 to-transparent border-teal-500/20",
                                    title: "Nova AI Assistant",
                                    desc: "Let AI generate captions, suggest hashtags, and find the perfect time to post when your audience is most active.",
                                }
                            ].map((ft, i) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={i}
                                    className={`bg-gradient-to-br ${ft.color} backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 group`}
                                >
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                                        {ft.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{ft.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed font-medium">{ft.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter uppercase line-clamp-2">Ready to level up?</h2>
                            <p className="text-emerald-100 text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">Join thousands of creators who use Schedly to stay organized and consistent.</p>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-10 py-5 bg-white text-emerald-700 text-lg font-black rounded-full hover:bg-emerald-50 hover:scale-105 transition-all shadow-xl active:scale-95"
                            >
                                Get Started For Free
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-16 z-10 relative bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <SchedlyLogo size="lg" className="text-white mb-4 block mx-auto md:mx-0" />
                            <p className="text-neutral-500 text-sm font-medium">Elevating social media workflows since 2026.</p>
                        </div>
                        <div className="flex gap-8 text-sm font-bold text-neutral-400">
                            <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Discord</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Changelog</a>
                        </div>
                        <p className="text-neutral-600 text-sm">© 2026 Schedly Inc.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
