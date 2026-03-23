import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRightIcon } from '../utils/Icons';

const Landing = () => {
    const user = useSelector((store) => store.user);

    const featureCards = [
        {
            title: "Discover Builders",
            desc: "Match with developers whose skillsets perfectly complement yours with algorithmic matchmaking.",
            icon: "🚀",
            color: "primary"
        },
        {
            title: "Secure Socket Chat",
            desc: "Real-time encrypted WebSockets ensure your conversations remain completely private.",
            icon: "💬",
            color: "secondary"
        },
        {
            title: "Premium Network",
            desc: "Unlock golden badges and zero-limit connection requests with our exclusive premium tier.",
            icon: "👑",
            color: "accent"
        }
    ];

    return (
        <div className="bg-base-100 overflow-x-hidden">
            {/* Hero Section with Glassmorphism */}
            <div className="relative isolate min-h-[90vh] flex flex-col justify-center">
                {/* Background Blobs */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fadeIn">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Developer Network</span>
                            </div>

                            <h1 className="text-5xl lg:text-8xl font-black tracking-tightest text-base-content leading-[0.9] mb-8 uppercase">
                                Connect. <br />
                                <span className="text-primary italic">Code.</span> <br />
                                Collaborate.
                            </h1>

                            <p className="text-lg md:text-xl opacity-60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                                The ultimate ecosystem for modern developers. Discover your next co-founder, swap tech stacks, and scale your professional circle with algorithmic precision.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {user ? (
                                    <Link to="/feed" className="btn btn-primary btn-lg rounded-2xl shadow-2xl shadow-primary/30 h-16 px-10 group transition-all duration-300">
                                        Open Dashboard
                                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/login" state={{ signup: true }} className="btn btn-primary btn-lg rounded-2xl shadow-xl shadow-primary/20 h-16 px-10 text-sm font-black uppercase tracking-widest hover:-translate-y-1 transition-all">Join the Community</Link>
                                        <Link to="/login" className="btn btn-ghost btn-lg rounded-2xl h-16 px-10 border border-base-200 hover:bg-base-200 transition-all text-sm font-black uppercase tracking-widest">Sign In</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual Side */}
                        <div className="relative order-1 lg:order-2">
                            <div className="relative group perspective-1000">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl group-hover:opacity-40 transition-opacity"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                                    className="relative rounded-[3rem] shadow-2xl border-2 border-base-200/50 p-2 transform rotate-2 hover:rotate-0 transition-all duration-700"
                                    alt="Developers Coding"
                                />
                                <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-base-300 p-6 rounded-3xl shadow-2xl border border-base-200 animate-float">
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-base-300 bg-base-100 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(https://i.pravatar.cc/150?u=${i})` }}></div>
                                            ))}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Active Developers</p>
                                            <p className="text-lg font-black leading-none">1,200+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Blob */}
                <div className="absolute inset-x-0 bottom-0 -z-10 translate-y-1/2 transform-gpu overflow-hidden blur-3xl">
                    <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary to-primary opacity-10 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 md:py-32 bg-base-200/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4 underline underline-offset-8">Core Experience</h2>
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content uppercase">Why Choose devMatch?</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {featureCards.map((card, i) => (
                            <div key={i} className="group p-10 bg-base-100 rounded-[2.5rem] border border-base-200 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500">
                                <div className={`w-16 h-16 bg-${card.color}/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <h4 className="text-xl font-black text-base-content mb-4 tracking-tight uppercase">{card.title}</h4>
                                <p className="opacity-60 text-sm leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-base-100 py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-primary/10 p-12 md:p-20 rounded-[3rem] border-2 border-primary/20 relative">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-base-content mb-6 uppercase">Ready to push your limits?</h2>
                        <p className="text-lg opacity-60 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                            Join thousands of developers and find your next game-changing collaboration today.
                        </p>
                        <Link to="/login" state={{ signup: true }} className="btn btn-primary btn-lg rounded-2xl px-12 group">
                            Start for Free
                            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Decorative floating dots */}
                        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-2 h-2 bg-secondary rounded-full animate-pulse duration-2000"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
