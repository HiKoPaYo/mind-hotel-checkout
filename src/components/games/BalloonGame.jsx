import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Sparkles, Flame, Plus } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function BalloonGame({ monsterData, onComplete, onExit }) {
  const [pumpCount, setPumpCount] = useState(0);
  const maxPumps = 8;
  const [isPopped, setIsPopped] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  const handlePump = () => {
    if (isPopped) return;

    const nextCount = pumpCount + 1;
    setPumpCount(nextCount);

    if (nextCount < maxPumps) {
      playSound.pump();
      if (navigator.vibrate) {
        try { navigator.vibrate(40); } catch (e) {}
      }
    } else {
      // POP!
      playSound.pop();
      setIsPopped(true);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      if (navigator.vibrate) {
        try { navigator.vibrate([100, 50, 150]); } catch (e) {}
      }

      // Massive Confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#3b82f6', '#fbbf24', '#10b981', '#a855f7'],
      });
    }
  };

  const resetGame = () => {
    playSound.click();
    setPumpCount(0);
    setIsPopped(false);
  };

  // Scale based on pump progress
  const currentScale = 1 + (pumpCount / maxPumps) * 1.5;

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative select-none ${screenShake ? 'animate-shake' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full border border-rose-400/20">
            🎈 펑! 터뜨리기
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 풍선 팽창 & 팡!
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Balloon Chamber */}
      <div
        onClick={!isPopped ? handlePump : undefined}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border border-slate-700 flex flex-col items-center justify-center cursor-pointer"
      >
        {/* Air Gauge */}
        <div className="absolute top-4 left-6 right-6 z-20">
          <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>풍선 공기 주입량</span>
            <span className="text-amber-400 font-bold">{Math.round((pumpCount / maxPumps) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 transition-all duration-200"
              style={{ width: `${(pumpCount / maxPumps) * 100}%` }}
            />
          </div>
        </div>

        {/* Floating Balloon Character */}
        {!isPopped ? (
          <div className="relative z-10 flex flex-col items-center animate-float">
            <div className="relative">
              <MonsterCharacter
                config={{
                  shape: monsterData.shape,
                  color: monsterData.color,
                  eyes: pumpCount > 4 ? 'scary' : 'smug',
                  mouth: pumpCount > 4 ? 'open' : 'zigzag',
                }}
                size={110}
                balloonScale={currentScale}
                isScared={pumpCount > 3}
              />
              {/* Balloon knot & string */}
              <div
                className="w-1.5 bg-white/40 mx-auto mt-1"
                style={{ height: `${30 * currentScale}px` }}
              />
            </div>

            <div className="mt-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-amber-300 font-medium">
              {pumpCount === 0 && '👇 풍선이나 펌프 버튼을 탭하세요!'}
              {pumpCount > 0 && pumpCount < 4 && '푸슈욱~ 풍선이 부풀고 있어요!'}
              {pumpCount >= 4 && pumpCount < maxPumps && '⚠️ 곧 터집니다! 조금만 더!'}
            </div>
          </div>
        ) : (
          <div className="relative z-20 text-center animate-pop">
            <div className="text-6xl mb-3">💥✨🎉</div>
            <h4 className="font-game text-3xl text-amber-300 font-black mb-1">
              펑! 시원하게 터졌습니다!
            </h4>
            <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
              "{monsterData.name}"이(가) 예쁜 색종이 조각으로<br />
              마음속에서 시원하게 사라졌어요!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {!isPopped ? (
          <button
            onClick={handlePump}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 text-slate-950 font-game text-xl font-black shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            <span>공기 펌프질하기! ({pumpCount} / {maxPumps})</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={resetGame}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>다시 터뜨리기</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('펑! 터뜨리기');
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
