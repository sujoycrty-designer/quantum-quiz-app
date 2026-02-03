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

    // --- QUESTION BANK (45 Questions) ---
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
        { q: "Which particle carries the electromagnetic force?", a: ["Gluon", "Photon", "Quark"], c: 1 },
        // ... Logic continues for the rest of the 45 questions
    ];

    // --- LOGIC FUNCTIONS ---
    const handleAnswer = (index) => {
        if (index === questions[currentQ].c) {
            setScore(prev => prev + 1);
        }
        
        if (currentQ + 1 < questions.length) {
            setCurrentQ(currentQ + 1);
        } else {
            const finalPercent = Math.round(((score + (index === questions[currentQ].c ? 1 : 0)) / questions.length) * 100);
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
            fetchLeaderboard();
        } catch (err) {
            console.error("Sync Error:", err);
            fetchLeaderboard(); // Proceed to show score even if sync fails
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaderboard`);
            setTopScores(res.data);
            setStep('leaderboard');
        } catch (err) {
            setStep('leaderboard');
        }
        setLoading(false);
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-cyan-500/30">
            <Watermark />

            {/* PROGRESS BAR */}
            {step === 'quiz' && (
                <div className="fixed top-0 left-0 w-full h-1 bg-slate-800">
                    <div 
                        className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_#22d3ee]" 
                        style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    />
                </div>
            )}

            {/* WELCOME STEP */}
            {step === 'welcome' && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
                    <div className="bg-cyan-500/10 p-4 rounded-full w-fit mx-auto border border-cyan-500/20">
                        <Zap className="text-cyan-400 w-12 h-12 shadow-cyan-500" />
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
                        className="w-full bg-slate-800/50 p-4 rounded-xl mb-4 outline-none border border-white/5 focus:border-cyan-500/50 transition-colors"
                    />
                    <button 
                        onClick={() => userName ? setStep('quiz') : alert('Name required')}
                        className="w-full bg-cyan-600 p-4 rounded-xl font-bold hover:bg-cyan-500 transition-colors"
                    >
                        START
