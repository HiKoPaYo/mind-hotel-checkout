import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function MunchGame({ monsterData, onComplete, onExit }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 75 }); // percentage
  const [isChewing, setIsChewing] = useState(false);
  const [chewCount, setChewCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [candyParticles, setCandyParticles] = useState([]);

  const containerRef = useRef(null);

  // Pointer drag logic
  const handlePointerDown = (e) => {
    if (isChewing || isFinished) return;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 15), 85);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 20), 85);

    setPos({ x, y });

    // Check collision with the mouth (Mouth center is at X: 50%, Y: 35%)
    const distToMouth = Math.hypot(x - 50, y - 35);
    if (distToMouth < 18) {
      triggerChew();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Trigger Munch / Chewing Animation
  const triggerChew = () => {
    setIsDragging(false);
    setIsChewing(true);
    setPos({ x: 50, y: 36 }); // inside mouth

    let currentChews = 0;
    const interval = setInterval(() => {
      currentChews++;
      setChewCount(currentChews);
      playSound.crunch();

      // Spawn candy particles
      const newCandies = Array.from({ length: 6 }).map((_, i) => ({
        id: Math.random(),
        x: 50 + (Math.random() * 30 - 15),
        y: 35 + (Math.random() * 20 - 10),
        emoji: ['🍬', '✨', '⭐', '🍭', '💖'][Math.floor(Math.random() * 5)],
      }));
      setCandyParticles(prev => [...prev.slice(-12), ...newCandies]);

      if (currentChews >= 5) {
        clearInterval(interval);
        setIsChewing(false);
        setIsFinished(true);
        playSound.healing();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      }
    }, 320);
  };

  const resetGame = () => {
    playSound.click();
    setIsChewing(false);
    setIsFinished(false);
    setChewCount(0);
    setCandyParticles([]);
    setPos({ x: 50, y: 75 });
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            👄 와작와작 씹어버리기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}"을(를) 달콤한 별사탕으로!
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Main Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border border-slate-700 touch-none flex flex-col justify-between"
      >
        {/* Candy Particles explosion */}
        {candyParticles.map(p => (
          <div
            key={p.id}
            className="absolute text-2xl animate-pop pointer-events-none transition-all duration-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* Big Cute Mouth */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="relative">
            {/* Cute Cartoon Eyes */}
            <div className="flex justify-center gap-12 mb-1">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-slate-900">
                <div className="w-3 h-3 rounded-full bg-slate-900" />
              </div>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-slate-900">
                <div className="w-3 h-3 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Mouth SVG */}
            <svg
              viewBox="0 0 160 100"
              className={`w-44 h-28 drop-shadow-xl transition-all duration-150 ${
                isChewing && chewCount % 2 === 1 ? 'scale-y-40' : 'scale-y-100'
              }`}
            >
              {/* Lips */}
              <ellipse cx="80" cy="50" rx="72" ry="42" fill="#f43f5e" stroke="#881337" strokeWidth="6" />
              {/* Inside cavity */}
              <ellipse cx="80" cy="50" rx="58" ry="28" fill="#4c0519" />
              {/* Cute white teeth */}
              <rect x="55" y="24" width="14" height="12" rx="3" fill="#fff" />
              <rect x="73" y="24" width="14" height="12" rx="3" fill="#fff" />
              <rect x="91" y="24" width="14" height="12" rx="3" fill="#fff" />
              {/* Cute tongue */}
              <ellipse cx="80" cy="64" rx="28" ry="12" fill="#fb7185" />
            </svg>
          </div>

          <div className="text-[11px] font-bold text-amber-300/80 mt-1">
            {isChewing ? '와작와작! 냠냠냠...' : isFinished ? '😋 꿀꺽! 맛있게 소화 완료!' : '입 속으로 드래그해 보세요!'}
          </div>
        </div>

        {/* Draggable Monster */}
        {!isFinished && (
          <div
            onPointerDown={handlePointerDown}
            className={`absolute z-30 cursor-grab active:cursor-grabbing transition-transform ${
              isChewing ? 'scale-50 opacity-70 animate-shake' : isDragging ? 'scale-110 drop-shadow-2xl' : 'hover:scale-105'
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <MonsterCharacter
                config={{
                  shape: monsterData.shape,
                  color: monsterData.color,
                  eyes: isChewing ? 'dizzy' : 'sad',
                  mouth: isChewing ? 'open' : 'frown',
                }}
                size={isChewing ? 70 : 100}
                isScared={isChewing}
              />
              {!isDragging && !isChewing && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 animate-bounce">
                  👆 잡아당겨서 입에 쏙!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Finished Result Message */}
        {isFinished && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40 animate-pop">
            <span className="text-5xl mb-2">✨🍬✨</span>
            <h4 className="font-game text-2xl text-amber-300 font-bold mb-1">
              달콤하게 사라졌어요!
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
              "{monsterData.name}"이(가) 와작와작 씹혀서<br />
              무해한 별사탕과 하트 조각으로 사라졌습니다!
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
              <span>한 번 더 먹이기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('와작와작 씹어버리기');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        ) : (
          <div className="w-full text-center py-2 text-xs text-slate-400 bg-slate-800/80 rounded-xl border border-slate-700">
            💡 캐릭터를 손가락/마우스로 집어서 <strong className="text-amber-300">커다란 입 안으로</strong> 드래그해 넣으세요!
          </div>
        )}
      </div>
    </div>
  );
}
