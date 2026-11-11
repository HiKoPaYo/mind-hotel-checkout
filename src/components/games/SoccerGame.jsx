import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Target } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function SoccerGame({ monsterData, onComplete, onExit }) {
  const [ballPos, setBallPos] = useState({ x: 50, y: 80 }); // percentage
  const [isAiming, setIsAiming] = useState(false);
  const [aimVector, setAimVector] = useState({ dx: 0, dy: 0 });
  const [gameState, setGameState] = useState('aiming'); // aiming, flying, goal, missed
  const [keeperX, setKeeperX] = useState(50); // percentage 25 to 75
  const [goalsCount, setGoalsCount] = useState(0);

  const containerRef = useRef(null);
  const animRef = useRef(null);
  const keeperDirRef = useRef(1);

  // Animate Goalkeeper horizontally
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setKeeperX(prev => {
        let next = prev + keeperDirRef.current * dt * 35;
        if (next > 72) {
          next = 72;
          keeperDirRef.current = -1;
        } else if (next < 28) {
          next = 28;
          keeperDirRef.current = 1;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Drag aiming handlers
  const handlePointerDown = (e) => {
    if (gameState !== 'aiming') return;
    setIsAiming(true);
    setAimVector({ dx: 0, dy: 0 });
  };

  const handlePointerMove = (e) => {
    if (!isAiming || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const ballScreenX = rect.left + (ballPos.x / 100) * rect.width;
    const ballScreenY = rect.top + (ballPos.y / 100) * rect.height;

    // Pull vector (opposite of shoot direction)
    const dx = (ballScreenX - clientX) * 0.4;
    const dy = (ballScreenY - clientY) * 0.4;

    // Limit maximum pull
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 90;
    if (dist > maxDist) {
      setAimVector({
        dx: (dx / dist) * maxDist,
        dy: (dy / dist) * maxDist,
      });
    } else {
      setAimVector({ dx, dy });
    }
  };

  const handlePointerUp = () => {
    if (!isAiming) return;
    setIsAiming(false);

    // If dragged enough, shoot!
    const dist = Math.sqrt(aimVector.dx * aimVector.dx + aimVector.dy * aimVector.dy);
    if (dist < 15) {
      setAimVector({ dx: 0, dy: 0 });
      return;
    }

    // Launch Ball
    playSound.kick();
    setGameState('flying');

    const shootStartX = ballPos.x;
    const shootStartY = ballPos.y;
    // Target position based on aim vector
    const targetX = shootStartX + (aimVector.dx / 3);
    const targetY = 22; // Goal line Y %

    const startTime = performance.now();
    const duration = 850;

    const shootAnimate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);

      // Arc curve
      const currX = shootStartX + (targetX - shootStartX) * p;
      const currY = shootStartY + (targetY - shootStartY) * p;
      setBallPos({ x: currX, y: currY });

      if (p < 1) {
        requestAnimationFrame(shootAnimate);
      } else {
        // Evaluate Goal or Keeper Save
        // Goal post is between X: 24% and 76%
        const isInsidePost = currX >= 25 && currX <= 75;
        // Check if keeper blocked it (keeper is width ~14%)
        const keeperSaved = Math.abs(currX - keeperX) < 9;

        if (isInsidePost && !keeperSaved) {
          // GOAL!!
          playSound.whistle();
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.4 } });
          setGameState('goal');
          setGoalsCount(prev => prev + 1);

          // Fly away into the distance
          let flyAwayP = 0;
          const flyAwayTimer = setInterval(() => {
            flyAwayP += 0.05;
            setBallPos(prev => ({ x: prev.x, y: prev.y - 3 }));
            if (flyAwayP >= 1) clearInterval(flyAwayTimer);
          }, 30);
        } else {
          // MISSED or SAVED
          playSound.poke();
          setGameState('missed');
        }
      }
    };

    requestAnimationFrame(shootAnimate);
  };

  const resetShoot = () => {
    playSound.click();
    setBallPos({ x: 50, y: 80 });
    setAimVector({ dx: 0, dy: 0 });
    setGameState('aiming');
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            ⚽ 축구 골인 챌린지
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 골문으로 슛!
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Soccer Pitch Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 border border-slate-700 touch-none flex flex-col justify-between"
      >
        {/* Goal Post Background */}
        <div className="absolute top-4 left-[22%] right-[22%] h-24 border-4 border-white/90 bg-white/10 rounded-t-lg backdrop-blur-xs flex items-center justify-center">
          {/* Net texture */}
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 2px, transparent 2px, transparent 12px), repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 12px)',
            }}
          />
        </div>

        {/* Goalkeeper (Cute barrier) */}
        <div
          className="absolute top-16 transition-all duration-75 pointer-events-none"
          style={{
            left: `${keeperX}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-14 h-12 bg-amber-400 rounded-2xl border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-950 shadow-md">
            🧤 수비수
          </div>
        </div>

        {/* Penalty Area Lines */}
        <div className="absolute top-28 left-[15%] right-[15%] h-36 border-2 border-white/50 rounded-b-2xl pointer-events-none" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-white/40 pointer-events-none" />

        {/* Aiming Vector Line (Trajectory) */}
        {isAiming && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <line
              x1={`${ballPos.x}%`}
              y1={`${ballPos.y}%`}
              x2={`${ballPos.x + aimVector.dx / 3}%`}
              y2={`${ballPos.y + aimVector.dy / 3}%`}
              stroke="#fbbf24"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <circle
              cx={`${ballPos.x + aimVector.dx / 3}%`}
              cy={`${ballPos.y + aimVector.dy / 3}%`}
              r="6"
              fill="#fbbf24"
            />
          </svg>
        )}

        {/* Monster Soccer Ball */}
        <div
          className="absolute z-30 transition-transform pointer-events-none"
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: `translate(-50%, -50%) scale(${gameState === 'goal' ? 0.4 : gameState === 'flying' ? 0.7 : 1})`,
          }}
        >
          <div className="relative group">
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: gameState === 'goal' ? 'dizzy' : 'smug',
                mouth: gameState === 'goal' ? 'open' : 'zigzag',
              }}
              size={85}
              ballMode={true}
              isScared={gameState === 'flying' || gameState === 'goal'}
            />
            {gameState === 'aiming' && (
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-slate-900/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                👇 뒤로 당겨서 슛!
              </div>
            )}
          </div>
        </div>

        {/* Result Alerts */}
        {gameState === 'goal' && (
          <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center z-40 animate-pop">
            <div className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-game text-3xl font-black shadow-2xl border-4 border-yellow-200 animate-jelly">
              ⚽ GOOOOAL!! 🥅
            </div>
            <p className="text-white text-sm font-bold mt-2 drop-shadow">
              "{monsterData.name}"이(가) 골대 뒤로 날아갔습니다!
            </p>
          </div>
        )}

        {gameState === 'missed' && (
          <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center z-40 animate-pop">
            <div className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-game text-xl font-bold shadow-xl">
              수비수에 막혔어요! 다시 조준해 보세요
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {(gameState === 'goal' || gameState === 'missed') ? (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={resetShoot}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>다시 슛 쏘기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('축구 골인 게임');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-game text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>배웅 완료!</span>
            </button>
          </div>
        ) : (
          <div className="w-full text-center py-2 text-xs text-slate-400 bg-slate-800/80 rounded-xl border border-slate-700">
            💡 캐릭터 공을 터치한 후 <strong className="text-amber-300">뒤로 당겼다가(슬링샷) 손을 떼면</strong> 시원하게 날아갑니다!
          </div>
        )}
      </div>
    </div>
  );
}
