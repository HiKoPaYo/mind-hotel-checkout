import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Download, RotateCcw, Sparkles, CheckCircle2, ShieldCheck, Sun, Heart, Hotel } from 'lucide-react';
import { playSound } from '../../utils/sound';

export default function Step6RoomStatus({
  managerInfo,
  monsterData,
  playedGames,
  finalEmotion,
  answers,
  stressBefore,
  stressAfter,
  onReset,
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    playSound.healing();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    playSound.click();
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `마음호텔_체크아웃인증서_${managerInfo.name || '지배인'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image download failed:', err);
      alert('인증서 이미지 저장에 실패했습니다. 화면을 캡처해 주세요!');
    } finally {
      setIsDownloading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 animate-pop">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>체크아웃 완료 · 룸 상태 100% 정상 회복</span>
        </div>
        <h2 className="font-game text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-black mb-2">
          "체크아웃이 완료되었습니다!"
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          불청객 <strong className="text-amber-400">"{monsterData.name}"</strong>이(가) 무사히 체크아웃되어 평온한 일상 룸이 복원되었습니다.
        </p>
      </div>

      {/* Hotel Room Condition Visualizer */}
      <div className="bg-gradient-to-b from-sky-900/60 to-slate-900 border border-amber-500/30 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
            <h3 className="font-game text-lg text-white font-bold">마음 호텔 스위트룸 404호 컨디션</h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            ☀️ 평온함 지수: 100%
          </span>
        </div>

        {/* Room Illustration Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">창가 햇살</span>
            <span className="text-amber-300 font-bold">따스한 햇살 가득 유입 중</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">스트레스 변화</span>
            <span className="text-emerald-300 font-bold">
              {stressBefore}점 ➔ {stressAfter}점 ({stressBefore - stressAfter > 0 ? `-${stressBefore - stressAfter}점 해소` : '유지'})
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">현재 감정</span>
            <span className="text-yellow-300 font-bold">{finalEmotion}</span>
          </div>
        </div>

        <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20">
          🌱 불청객은 언제든 다시 문을 두드릴 수 있습니다. 하지만 기억하세요! <br />
          마음 호텔의 지배인은 언제나 <strong>{managerInfo.name || '나'}</strong>이며, 당신은 언제든 재미있고 당당하게 불청객을 배웅할 수 있습니다.
        </p>
      </div>

      {/* Official Certificate Card (Can be exported as image) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs text-slate-400 font-semibold">📜 지배인 공식 체크아웃 인증서</span>
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? '저장 중...' : '인증서 이미지로 저장 (PNG)'}</span>
          </button>
        </div>

        <div
          ref={cardRef}
          className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left"
        >
          {/* Card Frame Decoration */}
          <div className="border border-amber-400/20 rounded-2xl p-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-400/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-game text-xl text-amber-300 font-bold">마음 호텔 체크아웃 인증서</h4>
                  <p className="text-[11px] text-slate-400 font-mono">MAUM HOTEL OFFICIAL RECEIPT</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-400 font-mono block">CERTIFIED</span>
                <span className="text-xs text-slate-300">{currentDate}</span>
              </div>
            </div>

            {/* Content Fields */}
            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">지배인 (학생)</span>
                <span className="text-white font-bold">
                  {managerInfo.grade ? `${managerInfo.grade}학년 ` : ''}
                  {managerInfo.classNum ? `${managerInfo.classNum} ` : ''}
                  {managerInfo.name || '익명의 지배인'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">체크아웃 불청객</span>
                <span className="text-rose-400 font-bold">
                  {monsterData.name} ({monsterData.category || '고민'})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">배웅 활동 미션</span>
                <span className="text-emerald-400 font-bold">
                  {playedGames.length > 0 ? playedGames.join(', ') : '자유 해소 미션'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">체크아웃 후 기분</span>
                <span className="text-amber-300 font-bold">{finalEmotion}</span>
              </div>
            </div>

            {/* Self-Compassion Quote from answers */}
            {answers.q3 && (
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-5">
                <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                  💌 나에게 건넨 따뜻한 한마디:
                </span>
                <p className="text-xs text-slate-200 italic font-medium">"{answers.q3}"</p>
              </div>
            )}

            {/* Footer with Hotel Stamp */}
            <div className="flex items-center justify-between pt-3 border-t border-amber-400/20">
              <span className="text-[10px] text-slate-400">
                위클래스(Wee Class) 내러티브 상담 연동 프로그램
              </span>
              {/* Gold Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-amber-400 text-amber-300 flex flex-col items-center justify-center font-game text-[10px] font-black rotate-[-12deg] shadow-lg shadow-amber-400/20 bg-amber-500/10">
                <span>마음호텔</span>
                <span className="text-[8px]">지배인 승인</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            playSound.click();
            if (window.confirm('새로운 불청객을 만나러 처음 화면으로 가시겠습니까?')) {
              onReset();
            }
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game text-lg font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>처음부터 다시 시작하기</span>
        </button>
      </div>
    </div>
  );
}
