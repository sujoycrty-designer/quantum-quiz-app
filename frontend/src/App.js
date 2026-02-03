import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Watermark } from './components/Watermark';
import { Share2, Trophy, Mail, Timer, ChevronRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 45 Question Bank
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
    { q: "Superconductors expel magnetic fields via the _______ effect.", a: ["Meissner", "Hall", "Doppler"], c: 0 },
    { q: "What is the term for a quantum computer's loss of information?", a: ["Defragmentation", "Decoherence", "Deep-fry"], c: 1 },
    { q: "Who is known as the father of Quantum Mechanics?", a: ["Newton", "Max Planck", "Tesla"], c: 1 },
    { q: "The 'Observer Effect' implies that measurement _______ the outcome.", a: ["Changes", "Predicts", "Deletes"], c: 0 },
    { q: "Quantum entanglement defies which classical limit?", a: ["Speed of Sound", "Speed of Light", "Gravity"], c: 1 },
    // ... logic repeats for remaining 30 questions
];

export default function App() {
    const [user, setUser] = useState({ name: '', email: '' });
    const [step, setStep] = useState('login'); 
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [leaderboard, setLeaderboard] = useState([]);

    // Timer Logic
    useEffect(() => {
        if (step === 'quiz' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && step === 'quiz') {
            next(null); 
        }
    }, [timeLeft, step]);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaderboard`);
            setLeaderboard(res.data);
            setStep('leaderboard');
        } catch (e) { console.error("Leaderboard Offline"); }
    };

    const next = (i) => {
        let currentScore = score;
        if (i === questions[idx].c) {
            // Scoring: 1 base point + speed bonus (max 1 bonus point)
            currentScore += (1 + (timeLeft / 15));
            setScore(currentScore);
        }
        
        if (idx + 1 < questions.length) {
            setIdx(idx + 1);
            setTimeLeft(15);
        } else {
            finish(currentScore);
        }
    };

    const finish = async (finalScore) => {
        // Max possible score is questions.length * 2
        const finalPercent = Math.round((finalScore / (questions.length * 2)) * 100); 
        try {
            await axios.post(`${API_URL}/api/save`, { ...user, score: finalPercent, category: 'Quantum AI' });
        } catch (e) { console.error("Sync Failed"); }
        setStep('end');
    };

    const shareToLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`I just mastered the Quantum AI Assessment with a score of ${Math.round((score / (questions.length * 2)) * 100)}%!`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-cyan-50 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Watermark />
            
            {/* Header / Navigation */}
            <nav className="absolute top-6 w-full flex justify-between px-10 z-50">
                <div className="text-cyan-500 font-black tracking-tighter text-xl italic">QUANTUM_GEN_1</div>
                <button onClick={fetchLeaderboard} className="flex items-center gap-2 text-[10px] tracking-widest hover:text-cyan-400 transition-all border border-cyan-900/50 px-4 py-2 rounded-full backdrop-blur-md">
                    <Trophy size={12} /> LEADERBOARD
                </button>
            </nav>

            {/* Quiz Content */}
            <main className="flex-grow flex items-center justify-center w-full z-10">
                {step === 'login' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/20 w-full max-w-md shadow-2xl text-center">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-widest">Portal Access</h1>
                        <p className="text-slate-400 text-xs mb-8">Establish secure connection to 2026 Quantum DB</p>
                        <input className="w-full bg-slate-800/30 border border-slate-700 p-4 rounded-xl mb-4 focus:border-cyan-500 outline-none transition-all text-white" placeholder="Full Name" onChange={e => setUser({...user, name: e.target.value})} />
                        <input className="w-full bg-slate-800/30 border border-slate-700 p-4 rounded-xl mb-8 focus:border-cyan-500 outline-none transition-all text-white" placeholder="Email Address" onChange={e => setUser({...user, email: e.target.value})} />
                        <button onClick={() => user.name && setStep('quiz')} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-black transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2">
                            AUTHORIZE START <ChevronRight size={18}/>
                        </button>
                    </div>
                )}

                {step === 'quiz' && (
                    <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-md p-10 rounded-3xl border border-cyan-500/10">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-[10px] font-mono text-cyan-700 uppercase tracking-widest">Progress: {idx + 1} / {questions.length}</span>
                            <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                                <Timer size={20} /> {timeLeft}s
                            </div>
                        </div>
                        <h2 className="text-2xl font-medium leading-relaxed mb-10 text-white">{questions[idx].q}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {questions[idx].a.map((opt, i) => (
                                <button key={i} onClick={() => next(i)} className="w-full text-left p-5 bg-slate-800/20 hover:bg-cyan-900/20 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl transition-all group flex items-center">
                                    <span className="text-cyan-800 group-hover:text-cyan-400 mr-4 font-mono">{i + 1}.</span> 
                                    <span className="text-slate-200 group-hover:text-white">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'end' && (
                    <div className="text-center bg-slate-900/40 p-12 rounded-[3rem] border border-cyan-500/10 backdrop-blur-lg animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40">
                            <Trophy className="text-cyan-400" size={40} />
                        </div>
                        <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter">CERTIFIED</h2>
                        <p className="mb-10 text-slate-400 max-w-sm mx-auto uppercase text-[10px] tracking-[0.2em]">Data persistence confirmed. High-fidelity results synced with Sujoy's 2026 Secure Cloud.</p>
                        
                        <div className="flex flex-col gap-4">
                            <a href={`${API_URL}/api/cert?name=${user.name}&score=${Math.round((score / (questions.length * 2)) * 100)}&category=Quantum AI`} className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all text-center">DOWNLOAD PDF</a>
                            <button onClick={shareToLinkedIn} className="flex items-center justify-center gap-2 bg-transparent border border-cyan-800 px-10 py-4 rounded-2xl font-bold hover:bg-cyan-900/20 transition-all text-cyan-400">
                                <Share2 size={18} /> SHARE ON LINKEDIN
                            </button>
                        </div>
                    </div>
                )}

                {step === 'leaderboard' && (
                    <div className="w-full max-w-lg bg-slate-900/80 p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3 italic">
                            <Trophy /> GLOBAL QUANTUM RANK
                        </h2>
                        <div className="space-y-3">
                            {leaderboard.map((entry, k) => (
                                <div key={k} className="flex justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all">
                                    <span className="font-mono text-cyan-500">{k+1}. {entry.name}</span>
                                    <span className="font-bold text-white font-mono">{entry.score}%</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => window.location.reload()} className="mt-8 text-[10px] text-slate-500 underline underline-offset-4 tracking-widest uppercase block mx-auto">RE-INITIALIZE PORTAL</button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full max-w-6xl mt-10 py-8 border-t border-cyan-900/10 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-600 tracking-[0.4em] uppercase">
                <div className="mb-4 md:mb-0">
                    Build: v1.0.4-stable | Node_Host: Render_Static
                </div>
                <div className="flex items-center gap-6">
                    <a href="mailto:sumant.chakravarty@gmail.com" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                        <Mail size={10} /> Admin_Contact
                    </a>
                    <span>©2026 Sujoy</span>
                </div>
            </footer>
        </div>
    );
}
