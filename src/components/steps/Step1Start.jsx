import React, { useState } from 'react';
import { KeyRound, Sparkles, ShieldCheck, ArrowRight, Smile } from 'lucide-react';
import MonsterCharacter from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

export default function Step1Start({ managerInfo, setManagerInfo, onNext }) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!managerInfo.name || managerInfo.name.trim() === '') {
      setErrorMsg('지배인님(학생)의 이름을 입력해 주세요!');
      return;
    }
    setErrorMsg('');
    playSound.click();
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-pop">
      {/* Hotel Emblem Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold mb-6 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>마음 호텔에 오신 것을 환영합니다</span>
      </div>

      {/* Main Title */}
      <h1 className="font-game text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-md mb-3 tracking-wide">
        불청객의 체크아웃
      </h1>

      {/* Sub Title */}
      <p className="font-game text-xl sm:text-2xl text-amber-100 font-semibold mb-4">
        "내 마음속 불청객, 이제 체크아웃할 시간입니다."
      </p>

      {/* Narrative Guide Box */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 mb-8 text-slate-300 text-sm sm:text-base leading-relaxed shadow-xl text-left">
        <p className="mb-2">
          👋 오늘도 나를 괴롭히는 <strong className="text-rose-400">불청객</strong>이 찾아왔나요?
        </p>
        <p className="mb-2 text-slate-300">
          불청객을 억지로 쫓아내거나 나 자신을 탓할 필요는 없어요. <br />
          <span className="text-yellow-300 font-bold">"내가 문제가 아니라, 나를 힘들게 하는 문제가 찾아왔을 뿐입니다."</span>
        </p>
        <p className="text-amber-200/90 font-medium">
          🏨 마음 호텔의 멋진 지배인이 되어 찾아온 불청객을 시원하고 재미있는 활동으로 배웅해 볼까요?
        </p>
      </div>

      {/* Cute Sample Monsters Floating */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="animate-float" style={{ animationDelay: '0s' }}>
          <MonsterCharacter
            config={{ shape: 'slime', color: 'purple', eyes: 'smug', mouth: 'zigzag' }}
            size={90}
          />
        </div>
        <div className="animate-float" style={{ animationDelay: '0.4s' }}>
          <MonsterCharacter
            config={{ shape: 'cloud', color: 'blue', eyes: 'glare', mouth: 'teeth' }}
            size={110}
          />
        </div>
        <div className="animate-float" style={{ animationDelay: '0.8s' }}>
          <MonsterCharacter
            config={{ shape: 'horn', color: 'red', eyes: 'scary', mouth: 'tongue' }}
            size={90}
          />
        </div>
      </div>

      {/* Hotel Manager Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
          <KeyRound className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white font-game">마음 호텔 지배인 등록</h2>
          <span className="text-xs text-slate-400 ml-auto">(위클래스 상담 연동)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Grade */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">학년</label>
            <select
              value={managerInfo.grade}
              onChange={(e) => setManagerInfo({ ...managerInfo, grade: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="1">중학교 1학년</option>
              <option value="2">중학교 2학년</option>
              <option value="3">중학교 3학년</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">반</label>
            <input
              type="text"
              placeholder="예: 3반"
              value={managerInfo.classNum}
              onChange={(e) => setManagerInfo({ ...managerInfo, classNum: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Name / Nickname */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              지배인 이름 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="이름 또는 별명"
              value={managerInfo.name}
              onChange={(e) => {
                setManagerInfo({ ...managerInfo, name: e.target.value });
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-rose-400 text-xs font-semibold mb-4 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Start Game Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game text-xl font-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>불청객 만나러 가기 (게임 시작하기)</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          🔒 입력된 내용은 마음 호텔 상담실에 안전하게 기록되며 나만의 평온함을 되찾는 데 사용됩니다.
        </p>
      </form>
    </div>
  );
}
