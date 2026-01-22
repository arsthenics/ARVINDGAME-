
import React from 'react';

interface ScoreboardProps {
  score: { A: number; B: number };
  status: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, status }) => {
  return (
    <div className="w-full bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center px-12">
      <div className="flex items-center gap-4">
        <div className="w-4 h-12 bg-blue-500 rounded-full"></div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Team Blue</p>
          <p className="text-4xl font-black">{score.A}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="px-3 py-1 bg-slate-700 rounded text-[10px] font-bold uppercase tracking-tighter text-slate-400 mb-1">
          VS
        </div>
        <div className="text-slate-500 font-mono text-sm">
          {status === 'PLAYING' ? 'LIVE MATCH' : status}
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Team Red</p>
          <p className="text-4xl font-black">{score.B}</p>
        </div>
        <div className="w-4 h-12 bg-red-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Scoreboard;
