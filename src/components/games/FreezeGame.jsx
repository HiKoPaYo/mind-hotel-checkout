import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Snowflake, Hammer } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function FreezeGame({ monsterData, onComplete, onExit }) {
  const [freezeProgress, setFreezeProgress] = useState(0); // 0 to 100
  const [isFrozen, setIsFrozen] = useState(false);
  const [isShattered, setIsShattered] = useState(false);

  const handleChargeFreeze = () => {
    if (isFrozen) return;
    playSound.freeze();

    setFreezeProgress(prev => {
      const next = prev + 25;
      if (next >= 100) {
        setIsFrozen(true);
        return 100;
      }
      return next;
    });
  };

  const handleShatter = () => {
    if (!isFrozen || isShattered) return;
    playSound.shatter();
    if (navigator.vibrate) {
      try { navigator.vibrate([60, 40, 100]); } catch (e) {}
    }
    setIsShattered(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#bae6fd', '#7dd3fc', '#38bdf8', '#ffffff'],
    });
  };

  const resetGame = () => {
    playSound.click();
    setFreezeProgress(0);
    setIsFrozen(false);
    setIsShattered(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
            ❄️ 꽁꽁 얼리고 깨뜨리기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 냉동 후 쨍그랑!
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
        onClick={isFrozen && !isShattered ? handleShatter : undefined}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-cyan-950/40 to-slate-950 border border-slate-700 flex flex-col items-center justify-center cursor-pointer"
      >
        {/* Ice Progress */}
        {!isFrozen && (
          <div className="absolute top-4 left-6 right-6 z-20">
            <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>급속 냉각 진행도</span>
              <span className="text-cyan-400 font-bold">{freezeProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-all duration-200"
                style={{ width: `${freezeProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Monster in center */}
        {!isShattered ? (
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <MonsterCharacter
                config={{
                  shape: monsterData.shape,
                  color: isFrozen ? 'blue' : monsterData.color,
                  eyes: isFrozen ? 'dizzy' : 'smug',
                  mouth: isFrozen ? 'open' : 'zigzag',
                }}
                size={140}
                isFrozen={isFrozen}
                className={isFrozen ? 'animate-pulse' : 'animate-float'}
              />

              {/* Ice block frame when frozen */}
              {isFrozen && (
                <div className="absolute inset-0 border-4 border-cyan-300/80 rounded-3xl bg-cyan-400/20 backdrop-blur-xs flex items-center justify-center animate-bounce">
                  <span className="text-xs font-bold text-white bg-cyan-700/80 px-2 py-1 rounded-full border border-cyan-300">
                    🔨 탭하여 깨뜨리기!
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-cyan-300 font-bold">
              {!isFrozen ? '아래 [아이스 빔 발사] 버튼을 연타하세요!' : '얼음 덩어리를 톡 건드려 깨뜨리세요!'}
            </div>
          </div>
        ) : (
          <div className="relative z-20 text-center animate-pop">
            <span className="text-6xl mb-3">💎✨🧊</span>
            <h4 className="font-game text-3xl text-cyan-300 font-black mb-1">
              쨍그랑! 산산조각 났어요!
            </h4>
            <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
              꽁꽁 얼어붙었던 "{monsterData.name}"이(가)<br />
              맑은 얼음 파편이 되어 사르르 녹아내렸습니다!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {!isFrozen ? (
          <button
            onClick={handleChargeFreeze}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 text-slate-950 font-game text-xl font-black shadow-xl shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Snowflake className="w-6 h-6 animate-spin" />
            <span>아이스 빔 발사! ({freezeProgress}%)</span>
          </button>
        ) : !isShattered ? (
          <button
            onClick={handleShatter}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-game text-xl font-black shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Hammer className="w-6 h-6" />
            <span>얼음 깨뜨리기! (쨍그랑 🔨)</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={resetGame}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>한 번 더 얼리기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('캐릭터 얼리기');
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
