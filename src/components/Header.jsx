import React, { useState } from 'react';
import { Volume2, VolumeX, Hotel, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { toggleMute, getMuteState, playSound } from '../utils/sound';

export default function Header({
  managerInfo,
  currentStep,
  onReset,
  onOpenCounselor,
}) {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggleSound = () => {
    const newState = toggleMute();
    setMuted(newState);
    if (!newState) playSound.click();
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-50 px-4 py-3 text-white transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo & Hotel Title */}
        <div
          onClick={() => {
            playSound.click();
            if (currentStep > 1 && window.confirm('처음 화면으로 돌아가시겠습니까?')) {
              onReset();
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Hotel className="w-6 h-6 text-slate-950" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-game text-xl tracking-wide text-amber-300 font-bold">
                마음 호텔
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                위클래스
              </span>
            </div>
            <p className="text-xs text-slate-400">불청객의 체크아웃</p>
          </div>
        </div>

        {/* Manager Badge if entered */}
        {managerInfo?.name && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <span className="text-amber-400 font-bold">🔑 지배인</span>
            <span className="text-slate-200">
              {managerInfo.grade ? `${managerInfo.grade}학년` : ''} {managerInfo.classNum ? `${managerInfo.classNum}반` : ''} {managerInfo.name}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? '소리 켜기' : '소리 끄기'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white border border-slate-700/60"
          >
            {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Counselor Dashboard Button */}
          <button
            onClick={() => {
              playSound.click();
              onOpenCounselor();
            }}
            title="상담실 기록 보관함"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 active:scale-95 transition-all text-indigo-300 border border-indigo-500/40 text-xs font-semibold"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">상담 기록함</span>
          </button>

          {/* Reset Button */}
          {currentStep > 1 && (
            <button
              onClick={() => {
                playSound.click();
                if (window.confirm('처음 화면으로 돌아가시겠습니까? 진행 중인 내용이 초기화됩니다.')) {
                  onReset();
                }
              }}
              title="처음으로 다시 시작"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 active:scale-95 transition-all border border-slate-700/60"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
