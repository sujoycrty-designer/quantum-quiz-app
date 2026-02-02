import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Timer, Mail, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Watermark } from './components/Watermark';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
    const [step, setStep] = useState('guide'); // guide, login, quiz, end, lead
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [user, setUser] = useState({ name: '', email: '' });

    // Questions: Add your 45 questions here
    const qList = [{ q: "What is Superposition?", a: ["One", "Both", "Zero"], c: 1 }];

    useEffect(() => {
        if (step === 'quiz' && timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(t);
        } else if (timeLeft === 0 && step === 'quiz') handleNext(null);
    }, [timeLeft, step]);

    const handleNext = (i) => {
        if (i === qList[0].c) setScore(s => s + 1 + (timeLeft/15));
        setStep('end'); // Simplified for this example
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center relative p-6">
            <Watermark />
            
            {step === 'guide' && (
                <div className="bg-slate-900 border border-cyan-500/30 p-8 rounded-3xl max-w-md z-50 shadow-2xl">
                    <h2 className="text-2xl font-black mb-6 text-cyan-400">SYSTEM PROTOCOL v1.0.4</h2>
                    <div className="space-y-4 mb-8 text-sm text-slate-300">
                        <p className="flex gap-2"><Zap size={16}/> Speed scoring active (15s per q).</p>
                        <p className="flex gap-2"><ShieldCheck size={16}/> Certificate unlocks at 70%.</p>
                    </div>
                    <button onClick={() => setStep('login')} className="w-full bg-cyan-600 p-4 rounded-xl font-bold">ACCEPT & ENTER</button>
                </div>
            )}

            {/* Login, Quiz, End screens as per previous logic... */}

            <footer className="absolute bottom-6 w-full flex justify-between px-10 text-[10px] text-slate-600 uppercase tracking-widest">
                <span>©2026 Sujoy</span>
                <a href="mailto:sumant.chakravarty@gmail.com" className="hover:text-cyan-400">sumant.chakravarty@gmail.com</a>
            </footer>
        </div>
    );
}
