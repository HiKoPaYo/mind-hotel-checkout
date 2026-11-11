import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Wind, Zap } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function WindGame({ monsterData, onComplete, onExit }) {
  const [windLevel, setWindLevel] = useState(1); // 1 to 5
  const [isBlownAway, setIsBlownAway] = useState(false);

  const handleWindBoost = () => {
    if (isBlownAway) return;
    playSound.wind();

    setWindLevel(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsBlownAway(true);
        playSound.healing();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
        return 5;
      }
      return next;
    });
  };

  const resetGame = () => {
    playSound.click();
    setWindLevel(1);
    setIsBlownAway(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/20">
            🌪️ 바람으로 멀리 날려보내기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 태풍급 바람으로 퇴장!
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Screen */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-teal-950/30 to-slate-950 border border-slate-700 flex flex-col items-center justify-center">
        {/* Wind Stream Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent rounded-full animate-pulse"
              style={{
                top: `${15 + i * 15}%`,
                left: '-20%',
                width: '140%',
                transform: `rotate(${windLevel * 2}deg)`,
                animationDuration: `${1.5 / windLevel}s`,
              }}
            />
          ))}
        </div>

        {/* Fan graphic on left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-80">
          <Wind className={`w-16 h-16 text-teal-400 ${windLevel > 2 ? 'animate-spin' : ''}`} />
          <span className="text-[10px] text-teal-300 font-mono mt-1">풍속 {windLevel}단</span>
        </div>

        {/* Monster in wind */}
        {!isBlownAway ? (
          <div
            className="relative z-10 flex flex-col items-center transition-all duration-300"
            style={{
              transform: `translateX(${windLevel * 25}px) rotate(${windLevel * 8}deg)`,
            }}
          >
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: windLevel > 2 ? 'dizzy' : 'glare',
                mouth: windLevel > 2 ? 'open' : 'zigzag',
              }}
              size={120}
              isScared={windLevel > 2}
            />
            <div className="mt-4 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-teal-300 font-bold">
              💨 풍속: {windLevel} / 5단 (버튼을 눌러 바람을 키우세요!)
            </div>
          </div>
        ) : (
          <div className="relative z-20 text-center animate-pop">
            <span className="text-6xl mb-3">🌪️💨🚀</span>
            <h4 className="font-game text-3xl text-teal-300 font-black mb-1">
              저 멀리 날아가 버렸어요!
            </h4>
            <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
              강력한 봄바람에 실려 "{monsterData.name}"이(가)<br />
              저 푸른 하늘 너머로 시원하게 날아갔습니다!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {!isBlownAway ? (
          <button
            onClick={handleWindBoost}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-game text-xl font-black shadow-xl shadow-teal-400/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-6 h-6" />
            <span>바람 세기 올리기! ({windLevel}단 → {windLevel + 1}단)</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={resetGame}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>다시 날리기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('바람으로 날려보내기');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
