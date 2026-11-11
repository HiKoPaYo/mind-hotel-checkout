import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Scissors, Cog } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function ShredderGame({ monsterData, onComplete, onExit }) {
  const [pos, setPos] = useState({ x: 50, y: 25 }); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isShredding, setIsShredding] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shredProgress, setShredProgress] = useState(0); // 0 to 1
  const [ribbons, setRibbons] = useState([]);

  const containerRef = useRef(null);

  // Drag handlers
  const handlePointerDown = () => {
    if (isShredding || isFinished) return;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 20), 80);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 15), 65);

    setPos({ x, y });

    // Check collision with shredder slot (Slot is at X: 50%, Y: 52%)
    if (y > 45 && Math.abs(x - 50) < 25) {
      startShredding();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const startShredding = () => {
    setIsDragging(false);
    setIsShredding(true);
    setPos({ x: 50, y: 50 });

    const startTime = performance.now();
    const duration = 2400;

    let soundTimer = setInterval(() => {
      playSound.shred();
    }, 280);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setShredProgress(progress);

      // Generate colorful falling ribbons
      if (Math.random() < 0.6) {
        setRibbons(prev => [
          ...prev.slice(-30),
          {
            id: Math.random(),
            x: 40 + Math.random() * 20,
            y: 65,
            color: ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'][Math.floor(Math.random() * 5)],
            length: 15 + Math.random() * 25,
          },
        ]);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(soundTimer);
        setIsShredding(false);
        setIsFinished(true);
        playSound.healing();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      }
    };

    requestAnimationFrame(animate);
  };

  const resetGame = () => {
    playSound.click();
    setIsShredding(false);
    setIsFinished(false);
    setShredProgress(0);
    setRibbons([]);
    setPos({ x: 50, y: 25 });
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            📑 스트레스 분쇄기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 잘게 분쇄하기
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Shredder Machine Screen */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-700 touch-none flex flex-col justify-between"
      >
        {/* Falling Shredded Paper Ribbons */}
        {ribbons.map(r => (
          <div
            key={r.id}
            className="absolute rounded-full animate-bounce pointer-events-none opacity-80"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: '4px',
              height: `${r.length}px`,
              backgroundColor: r.color,
              transform: 'translateY(20px) rotate(15deg)',
              transition: 'transform 0.4s ease-out',
            }}
          />
        ))}

        {/* Draggable Monster (Top) */}
        {!isFinished && (
          <div
            onPointerDown={handlePointerDown}
            className={`absolute z-30 cursor-grab active:cursor-grabbing transition-transform ${
              isShredding ? 'scale-90 animate-shake pointer-events-none' : isDragging ? 'scale-110 drop-shadow-2xl' : 'hover:scale-105'
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              clipPath: isShredding ? `inset(0 0 ${shredProgress * 100}% 0)` : 'none',
            }}
          >
            <div className="relative">
              <MonsterCharacter
                config={{
                  shape: monsterData.shape,
                  color: monsterData.color,
                  eyes: isShredding ? 'dizzy' : 'glare',
                  mouth: isShredding ? 'open' : 'zigzag',
                }}
                size={100}
                isScared={isShredding}
              />
              {!isDragging && !isShredding && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 animate-bounce">
                  👇 분쇄기 입구로 드래그!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shredder Machine Unit (Middle & Bottom) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 sm:w-80 flex flex-col items-center pointer-events-none z-20">
          {/* Shredder Slot */}
          <div className="w-full h-8 bg-slate-950 rounded-t-xl border-4 border-slate-700 border-b-0 flex items-center justify-center relative shadow-inner">
            <div className="w-48 h-2 bg-black rounded-full" />
            {/* Spinning Gears */}
            <Cog
              className={`w-6 h-6 text-amber-400 absolute left-3 ${
                isShredding ? 'animate-spin' : ''
              }`}
            />
            <Cog
              className={`w-6 h-6 text-amber-400 absolute right-3 ${
                isShredding ? 'animate-spin' : ''
              }`}
            />
          </div>

          {/* Machine Body */}
          <div className="w-full h-24 bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-700 rounded-b-2xl p-3 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SHREDDER UNIT 3000</span>
              <span className={`w-2.5 h-2.5 rounded-full ${isShredding ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
            </div>

            {/* Waste Bin Window */}
            <div className="w-full h-10 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
              <span className="text-[10px] text-slate-500">
                {isShredding ? '⚡ 종이 조각으로 분해 중...' : isFinished ? '✨ 분쇄 완료 바구니' : '투입구 대기 중'}
              </span>
            </div>
          </div>
        </div>

        {/* Result Overlay */}
        {isFinished && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40 animate-pop">
            <span className="text-5xl mb-2">✂️📜✨</span>
            <h4 className="font-game text-2xl text-amber-300 font-bold mb-1">
              말끔하게 분쇄되었습니다!
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
              "{monsterData.name}"이(가) 잘게 분해되어<br />
              더 이상 나를 어지럽힐 수 없게 되었어요!
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
              <span>한 번 더 분쇄하기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('분쇄기 게임');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        ) : (
          <div className="w-full text-center py-2 text-xs text-slate-400 bg-slate-800/80 rounded-xl border border-slate-700">
            💡 캐릭터를 집어서 <strong className="text-amber-300">분쇄기 투입구(가운데)</strong>로 드래그하세요!
          </div>
        )}
      </div>
    </div>
  );
}
