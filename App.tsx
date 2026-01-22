
import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import Scoreboard from './components/Scoreboard';
import ControlsInfo from './components/ControlsInfo';

const App: React.FC = () => {
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [gameStatus, setGameStatus] = useState<'START' | 'PLAYING' | 'GOAL' | 'FINISHED'>('START');
  const [winner, setWinner] = useState<'A' | 'B' | null>(null);

  const handleGoal = useCallback((team: 'A' | 'B') => {
    setScore(prev => {
      const newScore = { ...prev, [team]: prev[team] + 1 };
      if (newScore[team] >= 5) {
        setWinner(team);
        setGameStatus('FINISHED');
      } else {
        setGameStatus('GOAL');
        setTimeout(() => setGameStatus('PLAYING'), 2000);
      }
      return newScore;
    });
  }, []);

  const resetGame = () => {
    setScore({ A: 0, B: 0 });
    setWinner(null);
    setGameStatus('PLAYING');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 text-white overflow-hidden">
      <div className="relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border-4 border-slate-700 bg-slate-800">
        <Scoreboard score={score} status={gameStatus} />
        
        <div className="relative">
          <GameCanvas 
            onGoal={handleGoal} 
            status={gameStatus}
          />

          {gameStatus === 'START' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
              <h1 className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400 italic uppercase tracking-tighter">
                Super Pixel Soccer
              </h1>
              <button 
                onClick={() => setGameStatus('PLAYING')}
                className="px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-2xl font-bold rounded-full transform transition hover:scale-110 active:scale-95 shadow-lg border-b-4 border-emerald-700"
              >
                START MATCH
              </button>
            </div>
          )}

          {gameStatus === 'GOAL' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <h2 className="text-9xl font-black text-yellow-400 animate-bounce drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic uppercase">
                GOAL!!!
              </h2>
            </div>
          )}

          {gameStatus === 'FINISHED' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
              <h2 className="text-5xl font-black mb-4 uppercase tracking-widest">
                {winner === 'A' ? 'TEAM BLUE' : 'TEAM RED'} WINS!
              </h2>
              <div className="text-8xl mb-8">🏆</div>
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-full transform transition hover:scale-105 active:scale-95 shadow-xl"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <ControlsInfo />
      </div>

      <footer className="mt-8 text-slate-500 text-sm flex items-center gap-2">
        <i className="fa-solid fa-code"></i>
        <span>Built with React & Canvas API</span>
      </footer>
    </div>
  );
};

export default App;
