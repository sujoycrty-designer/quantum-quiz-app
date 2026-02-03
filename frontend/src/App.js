import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Watermark } from './components/Watermark';

import { Share2, Trophy, Mail, Timer } from 'lucide-react';



const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';



export default function App() {

    const [user, setUser] = useState({ name: '', email: '' });

    const [step, setStep] = useState('login'); // login, quiz, end, leaderboard

    const [idx, setIdx] = useState(0);

    const [score, setScore] = useState(0);

    const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question

    const [leaderboard, setLeaderboard] = useState([]);



    // Timer Logic

    useEffect(() => {

        if (step === 'quiz' && timeLeft > 0) {

            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

            return () => clearTimeout(timer);

        } else if (timeLeft === 0 && step === 'quiz') {

            next(null); // Auto-move if time runs out

        }

    }, [timeLeft, step]);



    const fetchLeaderboard = async () => {

        const res = await axios.get(`${API_URL}/api/leaderboard`);

        setLeaderboard(res.data);

        setStep('leaderboard');

    };



    const next = (i) => {

        if (i === questions[idx].c) {

            // Bonus points for speed: score + (seconds remaining / 10)

            setScore(s => s + 1 + (timeLeft / 15));

        }

        if (idx + 1 < questions.length) {

            setIdx(idx + 1);

            setTimeLeft(15); // Reset timer

        } else {

            finish();

        }

    };



    const finish = async () => {

        const finalPercent = Math.round((score / (questions.length * 2)) * 100); 

        await axios.post(`${API_URL}/api/save`, { ...user, score: finalPercent, category: 'Quantum AI' });

        setStep('end');

    };



    const shareToLinkedIn = () => {

        const url = encodeURIComponent(window.location.href);

        const text = encodeURIComponent(`I just mastered the Quantum AI Assessment with a top score! Check out my certification here:`);

        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');

    };



    return (

        <div className="min-h-screen bg-[#020617] text-cyan-50 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

            <Watermark />

            

            {/* Header / Navigation */}

            <nav className="absolute top-6 w-full flex justify-between px-10 z-50">

                <div className="text-cyan-500 font-black tracking-tighter text-xl">QUANTUM_GEN_1</div>

                <button onClick={fetchLeaderboard} className="flex items-center gap-2 text-xs hover:text-cyan-400 transition-all border border-cyan-900 px-4 py-2 rounded-full">

                    <Trophy size={14} /> LEADERBOARD

                </button>

            </nav>



            {/* Quiz Content */}

            <main className="flex-grow flex items-center justify-center w-full z-10">

                {step === 'login' && (

                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/20 w-full max-w-md shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] text-center">

                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-widest">Portal Access</h1>

                        <p className="text-slate-400 text-xs mb-8">Establish secure connection to Quantum DB</p>

                        <input className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-xl mb-4 focus:border-cyan-500 outline-none transition-all" placeholder="Enter Full Name" onChange={e => setUser({...user, name: e.target.value})} />

                        <input className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-xl mb-8 focus:border-cyan-500 outline-none transition-all" placeholder="Enter Email Address" onChange={e => setUser({...user, email: e.target.value})} />

                        <button onClick={() => setStep('quiz')} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/50">AUTHORIZE START</button>

                    </div>

                )}



                {step === 'quiz' && (

                    <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-md p-10 rounded-3xl border border-cyan-500/10 shadow-inner">

                        <div className="flex justify-between items-center mb-10">

                            <span className="text-xs font-mono text-cyan-700">PRG_INDEX: {idx + 1} / {questions.length}</span>

                            <div className={`flex items-center gap-2 font-mono text-lg ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>

                                <Timer size={18} /> {timeLeft}s

                            </div>

                        </div>

                        <h2 className="text-2xl font-medium leading-relaxed mb-10">{questions[idx].q}</h2>

                        <div className="grid grid-cols-1 gap-4">

                            {questions[idx].a.map((opt, i) => (

                                <button key={i} onClick={() => next(i)} className="w-full text-left p-5 bg-slate-800/30 hover:bg-cyan-900/20 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl transition-all group">

                                    <span className="text-cyan-800 group-hover:text-cyan-400 mr-4 font-mono">{i + 1}.</span> {opt}

                                </button>

                            ))}

                        </div>

                    </div>

                )}



                {step === 'end' && (

                    <div className="text-center bg-slate-900/40 p-12 rounded-[3rem] border border-cyan-500/10 backdrop-blur-lg">

                        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40">

                            <Trophy className="text-cyan-400" size={40} />

                        </div>

                        <h2 className="text-5xl font-black text-white mb-4">CERTIFIED</h2>

                        <p className="mb-10 text-slate-400 max-w-sm mx-auto uppercase tracking-tighter">Your high-fidelity results have been synced with Sujoy's 2026 Database.</p>

                        

                        <div className="flex flex-col gap-4">

                            <a href={`${API_URL}/api/cert?name=${user.name}&score=${score}&category=Quantum AI`} className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all">DOWNLOAD PDF</a>

                            <button onClick={shareToLinkedIn} className="flex items-center justify-center gap-2 bg-transparent border border-cyan-800 px-10 py-4 rounded-2xl font-bold hover:bg-cyan-900/20 transition-all text-cyan-400">

                                <Share2 size={18} /> SHARE ON LINKEDIN

                            </button>

                        </div>

                    </div>

                )}



                {step === 'leaderboard' && (

                    <div className="w-full max-w-lg bg-slate-900/80 p-8 rounded-3xl border border-cyan-500/30">

                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">

                            <Trophy /> GLOBAL QUANTUM RANK

                        </h2>

                        <div className="space-y-3">

                            {leaderboard.map((entry, k) => (

                                <div key={k} className="flex justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">

                                    <span className="font-mono text-cyan-500">{k+1}. {entry.name}</span>

                                    <span className="font-bold">{entry.score} pts</span>

                                </div>

                            ))}

                        </div>

                        <button onClick={() => setStep('login')} className="mt-8 text-xs text-slate-500 underline underline-offset-4">RETURN TO PORTAL</button>

                    </div>

                )}

            </main>



            {/* Footer with Branding & Email */}

            <footer className="w-full max-w-6xl mt-10 py-8 border-t border-cyan-900/20 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 tracking-[0.3em] uppercase">

                <div className="mb-4 md:mb-0">

                    Build: v1.0.4-stable | ©2026 Sujoy. All Rights Reserved.

                </div>

                <div className="flex items-center gap-6">

                    <a href="mailto:sumant.chakravarty@gmail.com?subject=Review" className="hover:text-cyan-400 transition-colors flex items-center gap-2">

                        <Mail size={12} /> Contact Administrator

                    </a>

                </div>

            </footer>

        </div>

    );

}
