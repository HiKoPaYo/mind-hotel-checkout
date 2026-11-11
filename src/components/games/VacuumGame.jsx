import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Sparkles, Wind } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function VacuumGame({ monsterData, onComplete, onExit }) {
  const [vacuumX, setVacuumX] = useState(50); // percentage
  const [vacuumY, setVacuumY] = useState(75);
  const [dusts, setDusts] = useState([
    { id: 1, x: 25, y: 35, size: 45, isMain: false },
    { id: 2, x: 70, y: 30, size: 50, isMain: false },
    { id: 3, x: 40, y: 50, size: 45, isMain: false },
    { id: 4, x: 80, y: 60, size: 50, isMain: false },
    { id: 5, x: 50, y: 30, size: 90, isMain: true }, // Main monster
  ]);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const containerRef = useRef(null);

  // Move vacuum with touch or mouse
  const handlePointerMove = (e) => {
    if (isFinished || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 10), 90);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 20), 85);

    setVacuumX(x);
    setVacuumY(y);

    // Collision check: suck in monsters close to vacuum head
    setDusts(prev => {
      const remaining = [];
      let suckedNew = 0;

      prev.forEach(d => {
        const dist = Math.hypot(d.x - x, d.y - y);
        if (dist < 14) {
          suckedNew++;
          playSound.vacuum();
        } else {
          remaining.push(d);
        }
      });

      if (suckedNew > 0) {
        setCleanedCount(c => {
          const next = c + suckedNew;
          if (next >= 5) {
            setIsFinished(true);
            playSound.healing();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          }
          return next;
        });
      }

      return remaining;
    });
  };

  const resetGame = () => {
    playSound.click();
    setCleanedCount(0);
    setIsFinished(false);
    setDusts([
      { id: 1, x: 25, y: 35, size: 45, isMain: false },
      { id: 2, x: 70, y: 30, size: 50, isMain: false },
      { id: 3, x: 40, y: 50, size: 45, isMain: false },
      { id: 4, x: 80, y: 60, size: 50, isMain: false },
      { id: 5, x: 50, y: 30, size: 90, isMain: true },
    ]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full border border-sky-400/20">
            🧹 초강력 진공청소기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 말끔히 빨아들이기
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Vacuum Field Screen */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 border border-slate-700 touch-none cursor-crosshair"
      >
        {/* Cleaning Progress Bar */}
        <div className="absolute top-4 left-6 right-6 z-20">
          <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>청소 진행도</span>
            <span className="text-sky-400 font-bold">{cleanedCount} / 5 마리 흡입</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-teal-300 transition-all duration-200"
              style={{ width: `${(cleanedCount / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Scattered Monsters floating around */}
        {dusts.map(d => (
          <div
            key={d.id}
            className="absolute z-10 animate-float pointer-events-none transition-transform duration-200"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: d.isMain ? 'glare' : 'dizzy',
                mouth: d.isMain ? 'zigzag' : 'open',
              }}
              size={d.size}
              isScared={true}
            />
            {d.isMain && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                본체
              </span>
            )}
          </div>
        ))}

        {/* Vacuum Nozzle (Follows mouse/finger) */}
        {!isFinished && (
          <div
            className="absolute z-30 pointer-events-none transition-transform duration-75"
            style={{
              left: `${vacuumX}%`,
              top: `${vacuumY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Suction Air Wind Lines */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-70 animate-pulse">
              <span className="w-1 h-6 bg-sky-300 rounded-full animate-bounce" />
              <span className="w-1 h-8 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-6 bg-sky-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>

            {/* Vacuum Head SVG */}
            <svg viewBox="0 0 100 80" className="w-24 h-20 drop-shadow-xl">
              {/* Pipe */}
              <rect x="42" y="35" width="16" height="45" rx="4" fill="#64748b" stroke="#334155" strokeWidth="2" />
              {/* Head Nozzle */}
              <polygon points="10,38 90,38 75,18 25,18" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
              {/* Suction brush edge */}
              <rect x="8" y="38" width="84" height="8" rx="3" fill="#38bdf8" />
            </svg>
          </div>
        )}

        {/* Finished Screen */}
        {isFinished && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40 animate-pop">
            <span className="text-5xl mb-2">✨🧹✨</span>
            <h4 className="font-game text-2xl text-sky-300 font-bold mb-1">
              방이 반짝반짝 깨끗해졌어요!
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
              도망치던 "{monsterData.name}"과(와) 모든 걱정 조각들이<br />
              청소기 먼지통 속으로 쏙 빨려 들어갔습니다!
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
              <span>한 번 더 청소하기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('청소기로 빨아들이기');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        ) : (
          <div className="w-full text-center py-2 text-xs text-slate-400 bg-slate-800/80 rounded-xl border border-slate-700">
            💡 화면 위에서 손가락이나 마우스를 움직여 <strong className="text-sky-300">청소기 노즐로 불청객들을</strong> 빨아들이세요!
          </div>
        )}
      </div>
    </div>
  );
}
