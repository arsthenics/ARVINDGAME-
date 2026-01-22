import React from 'react';

interface Props {
  isAIMode: boolean;
}

const ControlsInfo: React.FC<Props> = ({ isAIMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="glass p-5 rounded-2xl flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
          <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">Player 1 (Human)</h3>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 font-mono text-xs">
            <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">W</span>
            <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">A</span>
            <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">S</span>
            <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">D</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Space to Kick</span>
        </div>
      </div>

      <div className={`glass p-5 rounded-2xl flex flex-col items-center transition-opacity ${isAIMode ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
          <h3 className="text-sm font-black text-red-400 uppercase tracking-widest">
            {isAIMode ? 'Player 2 (AI Active)' : 'Player 2 (Human)'}
          </h3>
        </div>
        {isAIMode ? (
          <div className="text-[10px] text-slate-400 font-bold uppercase italic animate-pulse">
            Gemini Opponent is managing field position...
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 font-mono text-xs text-slate-400">
              <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">↑</span>
              <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">←</span>
              <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">↓</span>
              <span className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded border border-slate-700">→</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Enter to Kick</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsInfo;