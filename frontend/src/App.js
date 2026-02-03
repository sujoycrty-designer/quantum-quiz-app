import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Watermark } from './components/Watermark';
import { Trophy, Zap, ChevronRight, BarChart3, RefreshCcw } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com';

export default function App() {
    // --- STATE MANAGEMENT ---
    const [step, setStep] = useState('welcome'); 
    const [userName, setUserName] = useState('');
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- QUESTION BANK ---
    const questions = [
        { q: "What is the basic unit of quantum information?", a: ["Bit", "Byte", "Qubit"], c: 2 },
        { q: "Einstein called entanglement 'spooky action at a ______'.", a: ["Distance", "Speed", "Time"], c: 0 },
        { q: "Which principle says position and momentum cannot both be known?", a: ["Uncertainty", "Exclusion", "Relativity"], c: 0 },
        { q: "A state where a particle is in multiple states at once is...?", a: ["Coherence", "Superposition", "Tunneling"], c: 1 },
        { q: "In 2026, which Gemini model is built for on-device tasks?", a: ["Ultra", "Pro", "Nano"], c: 2 },
        { q: "Quantum computers use _______ to perform calculations.", a: ["Logic Gates", "Quantum Interference", "Binary Code"], c: 1 },
        { q: "What is the name of the 'cat' paradox in quantum mechanics?", a: ["Einstein's", "Schrödinger's", "Bohr's"], c: 1 },
        { q: "Neural Networks are inspired by which organ?", a: ["Heart", "Brain", "Lungs"], c: 1 },
        { q: "What happens when you observe a quantum system?", a: ["Waveform Collapses", "It Speeds Up", "Nothing"], c: 0 },
        { q: "Which particle carries the electromagnetic force?", a: ["Gluon", "Photon", "Quark"], c: 1 }
    ];

    // --- LOGIC FUNCTIONS ---
    const handleAnswer = (index) => {
        const isCorrect = index === questions[currentQ].c;
        const newScore = isCorrect ? score + 1 : score;
        
        if (currentQ + 1 < questions.length) {
            setScore(newScore);
            setCurrentQ(currentQ + 1);
        } else {
            const finalPercent = Math.round((newScore / questions.length) * 100);
            submitFinalResult(finalPercent);
        }
    };

    const submitFinalResult = async (finalPercent) => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/save`, {
                name: userName || "Anonymous",
                score: finalPercent,
                category: "Quantum Physics"
            });
        } catch (err) {
            console.error("Sync Error:", err);
        }
        fetchLeaderboard();
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaderboard`);
            setTopScores(res.data);
        } catch (err) {
            console.error("Fetch Error");
        }
        setStep('leaderboard');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            <Watermark />

            {/* PROGRESS BAR */}
            {step === 'quiz' && (
                <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
                    <div 
                        className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_#22d3ee]" 
                        style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            )}

            {/* WELCOME STEP */}
            {step === 'welcome' && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
                    <div className="bg-cyan-500/10 p-4 rounded-full w-fit mx-auto border border-cyan-500/20">
                        <Zap className="text-cyan-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                        QUANTUM PORTAL
                    </h1>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm uppercase tracking-widest">
                        Assessment Protocol v1.0.4 • 2026
                    </p>
                    <button 
                        onClick={() => setStep('login')} 
                        className="group flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-black hover:bg-cyan-400 transition-all active:scale-95"
                    >
                        ACCEPT & ENTER <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* LOGIN STEP */}
            {step === 'login' && (
                <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 w-full max-w-md backdrop-blur-xl">
                    <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
                    <p className="text-slate-400 text-sm mb-6">Enter your credentials to begin session.</p>
                    <input 
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full bg-slate-800/50 p-4 rounded-xl mb-4 outline-none border border-white/5 focus:border-cyan-500/50"
                    />
                    <button 
                        onClick={() => userName ? setStep('quiz') : alert('Name required')}
                        className="w-full bg-cyan-600 p-4 rounded-xl font-bold hover:bg-cyan-500 transition-colors"
                    >
                        START ASSESSMENT
                    </button>
                </div>
            )}

            {/* QUIZ STEP */}
            {step === 'quiz' && (
                <div className="max-w-xl w-full space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest">Question {currentQ + 1}</span>
                            <h2 className="text-2xl font-semibold mt-1 leading-tight">{questions[currentQ].q}</h2>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {questions[currentQ].a.map((opt, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleAnswer(i)} 
                                className="w-full text-left bg-slate-900/40 p-5 rounded-2xl hover:bg-white/5 border border-white/5 hover:border-cyan-500/50 transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* LEADERBOARD STEP */}
            {step === 'leaderboard' && (
                <div className="w-full max-w-md text-center">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-7xl font-black text-white mb-2">
                        {Math.round((score / questions.length) * 100)}%
                    </h1>
                    <p className="text-slate-400 mb-8 font-medium">Verification complete for {userName}.</p>
                    
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 text-left mb-6">
                        <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold text-sm uppercase tracking-tighter">
                            <BarChart3 size={18} /> Global Rankings
                        </div>
                        <div className="space-y-3">
                            {topScores.slice(0, 5).map((entry, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-slate-300">{i + 1}. {entry.name}</span>
                                    <span className="text-cyan-500 font-mono font-bold">{entry.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => window.location.reload()} 
                        className="flex items-center gap-2 mx-auto text-slate-500 hover:text-white transition-colors text-sm"
                    >
                        <RefreshCcw size={14} /> REBOOT SYSTEM
                    </button>
                </div>
            )}

            <footer className="mt-12 text-slate-600 text-[10px] uppercase tracking-[0.2em]">
                Secure Protocol • ©2026 Sujoy
            </footer>
        </div>
    );
}
