import React, { useState, useCallback, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import Scoreboard from './components/Scoreboard';
import ControlsInfo from './components/ControlsInfo';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [gameStatus, setGameStatus] = useState<'START' | 'PLAYING' | 'GOAL' | 'FINISHED'>('START');
  const [winner, setWinner] = useState<'A' | 'B' | null>(null);
  const [isAIMode, setIsAIMode] = useState(true);
  const [commentary, setCommentary] = useState("Welcome to Super Pixel Soccer!");

  const generateCommentary = async (event: string) => {
    try {
      // Use process.env.API_KEY directly as a string for GenAI initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a hype-focused soccer commentator for a pixel art game. 
        A game event just happened: "${event}". 
        Current Score: Blue ${score.A} - Red ${score.B}.
        Give a very short, 1-sentence explosive reaction.`,
      });
      // Correctly access text property from response
      if (response.text) setCommentary(response.text.trim());
    } catch (e) {
      console.error("Gemini Commentary Error:", e);
    }
  };

  const handleGoal = useCallback((team: 'A' | 'B') => {
    setScore(prev => {
      const newScore = { ...prev, [team]: prev[team] + 1 };
      const teamName = team === 'A' ? 'BLUE' : 'RED';
      
      generateCommentary(`GOAL for Team ${teamName}!`);

      if (newScore[team] >= 5) {
        setWinner(team);
        setGameStatus('FINISHED');
      } else {
        setGameStatus('GOAL');
        setTimeout(() => setGameStatus('PLAYING'), 2000);
      }
      return newScore;
    });
  }, [score]);

  const resetGame = () => {
    setScore({ A: 0, B: 0 });
    setWinner(null);
    setGameStatus('PLAYING');
    setCommentary("Match restarted! Let's go!");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-white overflow-hidden">
      <div className="relative w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <Scoreboard score={score} status={gameStatus} />
        
        <div className="bg-slate-800/50 py-2 px-6 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-400">
            <i className="fa-solid fa-microphone-lines animate-pulse"></i>
            <span className="text-xs font-mono uppercase tracking-widest">{commentary}</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase">P2 AI Mode</span>
             <button 
                onClick={() => setIsAIMode(!isAIMode)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isAIMode ? 'bg-emerald-500' : 'bg-slate-600'}`}
             >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isAIMode ? 'right-1' : 'left-1'}`}></div>
             </button>
          </div>
        </div>

        <div className="relative bg-emerald-900">
          <GameCanvas 
            onGoal={handleGoal} 
            status={gameStatus}
            isAIMode={isAIMode}
          />

          {gameStatus === 'START' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
              <div className="text-center mb-8">
                <h1 className="text-7xl font-black mb-2 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-white to-red-400">
                  SUPER PIXEL<br/>SOCCER
                </h1>
                <p className="text-slate-400 uppercase tracking-[0.3em] text-xs">Powered by Gemini AI</p>
              </div>
              <button 
                onClick={() => { setGameStatus('PLAYING'); generateCommentary("The match has begun!"); }}
                className="group relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                KICK OFF
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              </button>
            </div>
          )}

          {gameStatus === 'GOAL' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
               <div className="text-9xl font-black text-white animate-ping opacity-20 uppercase italic">GOAL</div>
               <div className="absolute text-8xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] italic uppercase animate-bounce">
                GOAL!!!
              </div>
            </div>
          )}

          {gameStatus === 'FINISHED' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center z-20">
              <h2 className="text-2xl text-slate-400 uppercase tracking-widest mb-2 font-bold">Match Results</h2>
              <h3 className={`text-6xl font-black mb-8 uppercase italic ${winner === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
                {winner === 'A' ? 'Team Blue' : 'Team Red'} Wins!
              </h3>
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-white text-slate-950 text-xl font-bold rounded-full hover:bg-slate-200 transition-all shadow-xl"
              >
                REMATCH
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <ControlsInfo isAIMode={isAIMode} />
      </div>

      <footer className="mt-8 text-slate-600 text-[10px] uppercase tracking-widest flex items-center gap-4">
        <span>© 2024 Pixel Labs</span>
        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
        <span>Built with Google Gemini</span>
      </footer>
    </div>
  );
};

export default App;