import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Droplets, Target } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function WaterBalloonGame({ monsterData, onComplete, onExit }) {
  const [hits, setHits] = useState(0);
  const maxHits = 5;
  const [splashes, setSplashes] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef(null);

  const handleThrow = (e) => {
    if (isFinished || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    playSound.splash();
    if (navigator.vibrate) {
      try { navigator.vibrate(50); } catch (err) {}
    }

    // Add splash animation
    const newSplash = {
      id: Math.random(),
      x,
      y,
      color: ['#38bdf8', '#60a5fa', '#818cf8', '#34d399'][Math.floor(Math.random() * 4)],
    };
    setSplashes(prev => [...prev.slice(-8), newSplash]);

    const nextHits = hits + 1;
    setHits(nextHits);

    if (nextHits >= maxHits) {
      setIsFinished(true);
      playSound.healing();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    }
  };

  const resetGame = () => {
    playSound.click();
    setHits(0);
    setSplashes([]);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full border border-sky-400/20">
            💧 시원한 물풍선 던지기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 물풍선 샤워!
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
      <div
        ref={containerRef}
        onClick={handleThrow}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-indigo-950 border border-slate-700 cursor-crosshair flex flex-col items-center justify-center"
      >
        {/* Splash marks */}
        {splashes.map(s => (
          <div
            key={s.id}
            className="absolute pointer-events-none rounded-full animate-ping opacity-60"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: '80px',
              height: '80px',
              backgroundColor: s.color,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Monster in center */}
        {!isFinished ? (
          <div className="relative z-10 flex flex-col items-center">
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: hits > 2 ? 'blue' : monsterData.color,
                eyes: hits > 0 ? 'dizzy' : 'smug',
                mouth: hits > 0 ? 'open' : 'zigzag',
              }}
              size={130}
              isScared={hits > 0}
              className={hits > 0 ? 'animate-shake' : 'animate-float'}
            />
            <div className="mt-4 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-sky-300 font-bold">
              💧 명중: {hits} / {maxHits}회 (화면을 탭해서 던지세요!)
            </div>
          </div>
        ) : (
          <div className="relative z-20 text-center animate-pop">
            <span className="text-6xl mb-3">🌊✨🫧</span>
            <h4 className="font-game text-3xl text-sky-300 font-black mb-1">
              상쾌하게 씻겨 내려갔어요!
            </h4>
            <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
              시원한 물풍선에 젖어든 "{monsterData.name}"이(가)<br />
              맑은 물방울이 되어 흩어졌습니다!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {isFinished ? (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={resetGame}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>한 번 더 던지기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('물풍선 던지기');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        ) : (
          <div className="w-full text-center py-2 text-xs text-slate-400 bg-slate-800/80 rounded-xl border border-slate-700">
            💡 화면의 불청객을 터치/클릭하여 <strong className="text-sky-300">시원한 물풍선을</strong> 던지세요!
          </div>
        )}
      </div>
    </div>
  );
}
