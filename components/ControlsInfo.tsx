
import React from 'react';

const ControlsInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <h3 className="text-lg font-bold text-blue-400 uppercase tracking-wide">Player 1 (Blue)</h3>
        </div>
        <div className="flex gap-4 items-center">
          <div className="grid grid-cols-3 gap-1">
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold">W</div>
            <div className="col-start-1 p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold">A</div>
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold">S</div>
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold">D</div>
          </div>
          <div className="h-12 w-[1px] bg-slate-700"></div>
          <div className="px-6 py-2 bg-slate-700 rounded border-b-2 border-slate-900 font-bold text-xs uppercase italic">Space to Kick</div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <h3 className="text-lg font-bold text-red-400 uppercase tracking-wide">Player 2 (Red)</h3>
        </div>
        <div className="flex gap-4 items-center">
          <div className="grid grid-cols-3 gap-1">
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold"><i className="fa-solid fa-arrow-up text-[10px]"></i></div>
            <div className="col-start-1 p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold"><i className="fa-solid fa-arrow-left text-[10px]"></i></div>
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold"><i className="fa-solid fa-arrow-down text-[10px]"></i></div>
            <div className="p-2 bg-slate-700 rounded text-xs border-b-2 border-slate-900 w-8 h-8 flex items-center justify-center font-bold"><i className="fa-solid fa-arrow-right text-[10px]"></i></div>
          </div>
          <div className="h-12 w-[1px] bg-slate-700"></div>
          <div className="px-6 py-2 bg-slate-700 rounded border-b-2 border-slate-900 font-bold text-xs uppercase italic">Enter to Kick</div>
        </div>
      </div>
    </div>
  );
};

export default ControlsInfo;
