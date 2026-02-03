import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Watermark } from './components/Watermark';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.onrender.com';

export default function App() {
    const [step, setStep] = useState('welcome'); 
    const [userName, setUserName] = useState('');
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);

    const questions = [
        { q: "What is the basic unit of quantum information?", a: ["Bit", "Byte", "Qubit"], c: 2 },
        { q: "Einstein called entanglement 'spooky action at a ______'.", a: ["Distance", "Speed", "Time"], c: 0 },
        // ... (The rest of your 45 questions go here)
    ];

    const handleAnswer = (index) => {
        if (index === questions[currentQ].c) setScore(score + 1);
        
        if (currentQ + 1 < questions.length) {
            setCurrentQ(currentQ + 1);
        } else {
            submitFinalResult();
        }
    };

    const submitFinalResult = async () => {
        try {
            await axios.post(`${API_URL}/api/save`, {
                name: userName,
                score: Math.round((score / questions.length) * 100),
                category: "Quantum Mechanics"
            });
            setStep('leaderboard');
        } catch (err) {
            console.error("Final sync failed", err);
            setStep('leaderboard'); // Move anyway to show score
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
            <Watermark />

            {step === 'welcome' && (
                <button onClick={() => setStep('login')} className="bg-cyan-600 px-10 py-4 rounded-full font-black">ACCEPT AND ENTER</button>
            )}

            {step === 'login' && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-cyan-500/30 w-full max-w-md">
                    <input 
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter Full Name" 
                        className="w-full bg-slate-800 p-3 rounded mb-4 outline-none border border-slate-700"
                    />
                    <button onClick={() => setStep('quiz')} className="w-full bg-cyan-600 p-3 rounded font-bold">START ASSESSMENT</button>
                </div>
            )}

            {step === 'quiz' && (
                <div className="max-w-xl w-full text-center">
                    <p className="text-cyan-500 mb-2">Question {currentQ + 1} of {questions.length}</p>
                    <h2 className="text-2xl font-bold mb-6">{questions[currentQ].q}</h2>
                    <div className="grid gap-4">
                        {questions[currentQ].a.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(i)} className="bg-slate-800 p-4 rounded-xl hover:bg-slate-700 border border-slate-700">
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'leaderboard' && (
                <div className="text-center">
                    <h1 className="text-6xl font-black text-cyan-400 mb-4">{Math.round((score / questions.length) * 100)}%</h1>
                    <p className="mb-6">Assessment Complete, {userName}!</p>
                    <button onClick={() => window.location.reload()} className="text-cyan-500 underline">RETAKE PORTAL</button>
                </div>
            )}
        </div>
    );
}
