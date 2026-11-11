import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Zap, Trophy } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function BaseballGame({ monsterData, onComplete, onExit }) {
  const [gameState, setGameState] = useState('ready'); // ready, pitching, hit, missed, result
  const [distance, setDistance] = useState(0);
  const [hitQuality, setHitQuality] = useState(''); // PERFECT, HOME RUN, OUT-OF-PARK
  const [pitchProgress, setPitchProgress] = useState(0); // 0 to 1
  const [isSwinging, setIsSwinging] = useState(false);
  const [flyCoord, setFlyCoord] = useState({ x: 50, y: 50, scale: 1, rotate: 0 });
  const [scoreCount, setScoreCount] = useState(0);
  const [screenShake, setScreenShake] = useState(false);

  const pitchRef = useRef(null);

  // Start a pitch
  const startPitch = () => {
    playSound.click();
    setGameState('pitching');
    setPitchProgress(0);
    const startTime = performance.now();
    const duration = 1400; // 1.4s to reach plate

    const animatePitch = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPitchProgress(progress);

      if (progress < 1) {
        pitchRef.current = requestAnimationFrame(animatePitch);
      } else {
        // Missed swing
        setGameState('missed');
        setHitQuality('STRIKE!');
      }
    };

    pitchRef.current = requestAnimationFrame(animatePitch);
  };

  useEffect(() => {
    return () => {
      if (pitchRef.current) cancelAnimationFrame(pitchRef.current);
    };
  }, []);

  // Swing bat
  const handleSwing = () => {
    if (gameState !== 'pitching') return;

    if (pitchRef.current) cancelAnimationFrame(pitchRef.current);
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 250);

    // Timing check
    // Best timing is progress between 0.75 and 0.92
    const p = pitchProgress;

    if (p >= 0.65 && p <= 0.96) {
      // HIT!
      playSound.hit();
      if (navigator.vibrate) {
        try { navigator.vibrate([80, 50, 120]); } catch (e) {}
      }

      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);

      let dist = 120;
      let quality = '안타!';
      if (p >= 0.78 && p <= 0.88) {
        dist = Math.floor(350 + Math.random() * 200);
        quality = '🚀 장외 대형 홈런!';
        playSound.homeRun();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } else {
        dist = Math.floor(180 + Math.random() * 80);
        quality = '💥 호쾌한 홈런!';
        playSound.homeRun();
      }

      setDistance(dist);
      setHitQuality(quality);
      setGameState('hit');
      setScoreCount(prev => prev + 1);

      // Launch monster flying away animation
      const flyStart = performance.now();
      const flyDuration = 1800;

      const flyAnimate = (now) => {
        const flyProgress = Math.min((now - flyStart) / flyDuration, 1);
        // Exponential flight curve
        const x = 50 + flyProgress * 90;
        const y = 60 - flyProgress * 140;
        const scale = Math.max(1 - flyProgress * 0.95, 0.05);
        const rotate = flyProgress * 1080;

        setFlyCoord({ x, y, scale, rotate });

        if (flyProgress < 1) {
          requestAnimationFrame(flyAnimate);
        } else {
          setGameState('result');
        }
      };

      requestAnimationFrame(flyAnimate);
    } else {
      // Missed timing
      setGameState('missed');
      setHitQuality('헛스윙! 타이밍을 노려보세요');
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 shadow-2xl relative overflow-hidden select-none ${screenShake ? 'animate-shake' : ''}`}>
      {/* Stadium Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            ⚾ 야구 홈런 챌린지
          </span>
          <h3 className="font-game text-xl text-white font-bold mt-1">
            "{monsterData.name}" 시원하게 날려버리기!
          </h3>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          게임 목록
        </button>
      </div>

      {/* Baseball Stadium Screen */}
      <div
        onClick={gameState === 'pitching' ? handleSwing : undefined}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-emerald-950 border border-slate-700 flex flex-col items-center justify-end cursor-pointer"
      >
        {/* Stadium Lights & Crowd Silhouette */}
        <div className="absolute top-2 left-4 text-xs text-slate-500 font-mono">
          FIELD: MAUM STADIUM · COUNT: {scoreCount} HR
        </div>

        {/* Home Run Wall */}
        <div className="absolute bottom-28 w-full border-b-2 border-yellow-500/40 opacity-40" />

        {/* Distance Banner if Hit */}
        {(gameState === 'hit' || gameState === 'result') && (
          <div className="absolute top-8 z-30 animate-pop text-center">
            <div className="px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-game font-black text-2xl shadow-xl border-2 border-yellow-200">
              {hitQuality}
            </div>
            <div className="text-amber-200 text-sm font-bold mt-1 drop-shadow">
              비거리: <span className="text-xl text-white font-mono">{distance}m</span> 장외 비행 중!
            </div>
          </div>
        )}

        {/* Missed text */}
        {gameState === 'missed' && (
          <div className="absolute top-12 z-30 animate-pop text-center">
            <div className="px-4 py-2 rounded-xl bg-rose-500 text-white font-game font-bold text-lg shadow-lg">
              {hitQuality}
            </div>
          </div>
        )}

        {/* Flying Monster during HIT */}
        {gameState === 'hit' && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left: `${flyCoord.x}%`,
              top: `${flyCoord.y}%`,
              transform: `translate(-50%, -50%) scale(${flyCoord.scale}) rotate(${flyCoord.rotate}deg)`,
            }}
          >
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: 'dizzy',
                mouth: 'open',
              }}
              size={120}
              isScared={true}
            />
          </div>
        )}

        {/* Pitching Monster: comes from far away toward home plate */}
        {gameState === 'pitching' && (
          <div
            className="absolute z-20 pointer-events-none transition-all"
            style={{
              bottom: `${20 + pitchProgress * 50}%`,
              left: '50%',
              transform: `translateX(-50%) scale(${0.25 + pitchProgress * 0.95}) rotate(${pitchProgress * 720}deg)`,
              opacity: Math.min(pitchProgress * 2, 1),
            }}
          >
            <div className="relative">
              <MonsterCharacter
                config={{
                  shape: monsterData.shape,
                  color: monsterData.color,
                  eyes: 'glare',
                  mouth: 'zigzag',
                }}
                size={140}
              />
              {/* Pitch timing helper ring */}
              {pitchProgress > 0.65 && pitchProgress < 0.95 && (
                <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping pointer-events-none" />
              )}
            </div>
          </div>
        )}

        {/* Home Plate Batter Area */}
        <div className="relative z-10 mb-4 flex flex-col items-center">
          {/* Batter Bat */}
          <div
            className={`w-6 h-28 origin-bottom rounded-t-full bg-gradient-to-t from-amber-800 via-amber-600 to-yellow-400 shadow-xl border border-amber-900 transition-transform duration-100 ${
              isSwinging ? 'rotate-[-95deg] scale-110' : '-rotate-25'
            }`}
          />
          {/* Home plate marker */}
          <div className="w-16 h-8 bg-white/90 transform rotate-45 rounded-sm shadow-md mt-1" />
        </div>

        {/* Guidance Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
            <span className="text-4xl mb-2">⚾</span>
            <h4 className="font-game text-2xl text-white font-bold mb-1">
              배트로 불청객 날려버리기!
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
              [투구 시작]을 누르면 불청객이 날아옵니다.<br />
              홈 플레이트에 가까워졌을 때 <strong className="text-amber-300">화면이나 스윙 버튼</strong>을 딱 맞춰 탭하세요!
            </p>
            <button
              onClick={startPitch}
              className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-game text-lg font-black shadow-lg shadow-amber-400/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>투구 시작! (PITCH)</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {gameState === 'pitching' && (
          <button
            onClick={handleSwing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-amber-500 to-yellow-400 text-slate-950 font-game text-2xl font-black shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>지금 스윙! (SWING 💥)</span>
          </button>
        )}

        {(gameState === 'missed' || gameState === 'result') && (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={startPitch}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-game text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>다시 날리기 (한 번 더!)</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                onComplete('야구 홈런 게임');
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
