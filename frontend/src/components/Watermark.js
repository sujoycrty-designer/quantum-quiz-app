import React from 'react';

export const Watermark = () => {
  return (
    <div className="fixed bottom-4 right-6 pointer-events-none opacity-20 z-50">
      <h1 className="text-cyan-500 font-black tracking-tighter text-2xl select-none">
        QUANTUM_AI_2026
      </h1>
      <p className="text-[8px] text-slate-500 text-right uppercase tracking-[0.3em]">
        Verified by Sujoy
      </p>
    </div>
  );
};
