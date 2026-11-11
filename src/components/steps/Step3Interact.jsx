import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, HeartHandshake, Sparkles, Shield, Flame } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

const MONSTER_QUOTES = [
  "흥! 내가 널 하루 종일 불안하게 만들 거다!",
  "오늘도 날 신경 쓰느라 정신없지?",
  "넌 날 쉽게 못 떨쳐낼걸?",
  "어라? 왜 날 콕콕 찌르는 거야?!",
  "으앗! 찌르지 마! 난 무시무시한 불청객이란 말이야!",
  "쳇, 네 마음 호텔에서 난 평생 살 거야!",
  "뭐야, 왜 날 보고도 쫄지 않지?",
];

const MANAGER_RESPONSES = [
  { id: '1', text: "너 왔구나? 하지만 여긴 내 마음 호텔이야. 내가 지배인이지!" },
  { id: '2', text: "잠깐 머물 순 있지만, 맘대로 어지럽힐 수는 없어." },
  { id: '3', text: "내가 너한테 휘둘릴 줄 알았어? 난 나만의 방법이 있거든!" },
];

export default function Step3Interact({
  monsterData,
  stressBefore,
  setStressBefore,
  onNext,
  onPrev,
}) {
  const [isPoked, setIsPoked] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(`안녕? 난 네 마음의 "${monsterData.name}"이야!`);
  const [selectedResponse, setSelectedResponse] = useState(MANAGER_RESPONSES[0].text);

  const handlePokeMonster = () => {
    playSound.poke();
    setIsPoked(true);
    setPokeCount(prev => prev + 1);

    // Pick random quote
    const nextQuote = MONSTER_QUOTES[Math.floor(Math.random() * MONSTER_QUOTES.length)];
    setCurrentQuote(nextQuote);

    setTimeout(() => {
      setIsPoked(false);
    }, 400);
  };

  const handleNext = () => {
    playSound.click();
    onNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 animate-pop">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playSound.click();
            onPrev();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전</span>
        </button>
        <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          STEP 3 · 불청객 인사 & 거리두기
        </span>
      </div>

      {/* Narrative Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-2">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>심리적 거리두기 (Externalization)</span>
        </div>
        <h2 className="font-game text-2xl sm:text-3xl text-white font-black mb-1">
          "잠시 묵고 있는 불청객 인사시키기"
        </h2>
        <p className="text-amber-200/90 font-medium text-sm sm:text-base">
          "너 왔구나? 하지만 여긴 내 마음이야. 내가 주인이란다."
        </p>
      </div>

      {/* Interactive Room Card */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
        {/* Soft radial background */}
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-slate-900/60 to-slate-900 pointer-events-none" />

        {/* Room Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/80 pb-3 mb-6 relative z-10">
          <span className="font-semibold text-slate-300">🚪 마음 호텔 객실 404호</span>
          <span className="text-amber-400 font-medium">👉 불청객을 손가락으로 콕콕 찔러보세요!</span>
        </div>

        {/* Monster Speech Bubble */}
        <div className="relative z-10 max-w-md mx-auto mb-4 animate-pop">
          <div className="relative bg-amber-400 text-slate-950 font-game text-sm sm:text-base p-4 rounded-2xl shadow-lg border-2 border-amber-300 text-center font-bold">
            <span className="text-xs block text-slate-800 font-medium mb-0.5">[{monsterData.name}의 말]</span>
            "{currentQuote}"
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 border-r-2 border-b-2 border-amber-300 transform rotate-45" />
          </div>
        </div>

        {/* Center: Interactive Monster */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <div
            onClick={handlePokeMonster}
            className={`transition-transform cursor-pointer select-none ${
              isPoked ? 'scale-90 animate-jelly' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: monsterData.eyes,
                mouth: monsterData.mouth,
              }}
              size={190 * (monsterData.size || 1)}
              isPoked={isPoked}
              isScared={pokeCount > 4}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
              콕 찌른 횟수: <strong className="text-amber-400">{pokeCount}</strong>회
            </span>
            {pokeCount > 3 && (
              <span className="text-xs text-yellow-300 animate-pulse font-medium">
                😅 불청객이 당황하기 시작했어요!
              </span>
            )}
          </div>
        </div>

        {/* Manager Response Selection */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-700">
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>지배인(나)의 당당한 한마디 선택하기:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MANAGER_RESPONSES.map((res) => {
              const isSelected = selectedResponse === res.text;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    playSound.click();
                    setSelectedResponse(res.text);
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all leading-relaxed ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/30'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  "{res.text}"
                </button>
              );
            })}
          </div>
        </div>

        {/* Stress Level Slider */}
        <div className="relative z-10 mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>지금 이 불청객이 나에게 주는 스트레스 지수는?</span>
            </span>
            <span className="text-base font-game font-bold text-rose-400">
              {stressBefore} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stressBefore}
            onChange={(e) => setStressBefore(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 (살짝 신경 쓰임)</span>
            <span>5 (보통 스트레스)</span>
            <span>10 (매우 답답하고 벅참)</span>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game text-lg font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>불청객 체크아웃 시키러 가기 (게임 선택)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
