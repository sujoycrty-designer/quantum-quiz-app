import React, { useState } from 'react';
import { Watermark } from './components/Watermark';

export default function App() {
    // 1. Initialize State
    const [step, setStep] = useState('welcome'); 

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center">
            <Watermark />

            {/* STEP 1: WELCOME */}
            {step === 'welcome' && (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6 text-cyan-400">QUANTUM PORTAL</h1>
                    <button 
                        onClick={() => setStep('login')} 
                        className="bg-cyan-600 px-10 py-4 rounded-full font-black hover:bg-cyan-400 transition-all"
                    >
                        ACCEPT AND ENTER
                    </button>
                </div>
            )}

            {/* STEP 2: LOGIN (This is what shows AFTER the click) */}
            {step === 'login' && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-cyan-500/30">
                    <h2 className="text-xl mb-4 text-center">Identity Verification</h2>
                    <input 
                        type="text" 
                        placeholder="Enter Name" 
                        className="w-full bg-slate-800 p-3 rounded mb-4 outline-none border border-slate-700 focus:border-cyan-500"
                    />
                    <button 
                        onClick={() => setStep('quiz')} 
                        className="w-full bg-cyan-600 p-3 rounded font-bold"
                    >
                        START ASSESSMENT
                    </button>
                </div>
            )}

            {/* STEP 3: QUIZ (Fallback so it's never blank) */}
            {step === 'quiz' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Quiz Loading...</h2>
                    <p className="text-slate-400">Initializing Quantum Grids</p>
                </div>
            )}
        </div>
    );
}
