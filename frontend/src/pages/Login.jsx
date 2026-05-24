import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import SchedlyLogo from '../components/SchedlyLogo';

const Login = () => {
    const { login, googleLogin } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden px-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen float-slow"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full z-10"
            >
                <div className="flex justify-center mb-10">
                    <Link to="/">
                        <SchedlyLogo size="lg" className="text-white hover:scale-105 transition-transform" />
                    </Link>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-neutral-400 font-medium">Continue your content journey.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-6 flex items-center gap-3 font-medium"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-neutral-300">Password</label>
                                <a href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-md"></span>
                            ) : (
                                <>
                                    Sign In
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                            <span className="px-4 bg-[#09090b] text-neutral-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center bg-white rounded-2xl p-1 hover:scale-[1.02] transition-transform">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                googleLogin(credentialResponse.credential);
                            }}
                            onError={() => {
                                setError('Google login failed');
                            }}
                            useOneTap
                            theme="outline"
                            shape="pill"
                            width="100%"
                        />
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-neutral-400 font-medium text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-neutral-600">
                    <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-neutral-400">Terms of Service</a>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
