import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { playSound } from '../../utils/sound';

export const GAME_LIST = [
  {
    id: 'baseball',
    title: '야구 홈런 게임',
    desc: '스펀지 야구 배트로 호쾌한 스윙! 장외 홈런 날리기',
    icon: '⚾',
    badge: '추천',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'soccer',
    title: '축구 골인 게임',
    desc: '캐릭터 공을 뒤로 당겨 수비수를 피해 골대로 슛!',
    icon: '⚽',
    badge: '추천',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'munch',
    title: '와작와작 씹어버리기',
    desc: '커다란 귀여운 입에 쏙 드래그! 달콤한 별사탕으로 변신',
    icon: '👄',
    badge: '인기',
    color: 'from-pink-500 to-rose-400',
  },
  {
    id: 'balloon',
    title: '펑! 터뜨리기',
    desc: '풍선처럼 펌프질하여 부풀린 후 화려한 색종이 폭발!',
    icon: '🎈',
    badge: '인기',
    color: 'from-rose-500 to-orange-400',
  },
  {
    id: 'shredder',
    title: '분쇄기 게임',
    desc: '투입구로 쏙 넣어 무지개 종이 리본으로 샤라락 분쇄',
    icon: '✂️',
    badge: '시원함',
    color: 'from-indigo-500 to-purple-400',
  },
  {
    id: 'vacuum',
    title: '청소기로 빨아들이기',
    desc: '초강력 진공청소기 노즐로 구석구석 남김없이 흡입',
    icon: '🧹',
    badge: '상쾌함',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'water',
    title: '물풍선 던지기',
    desc: '시원한 물풍선 샤워로 어두운 마음을 깨끗이 씻어내기',
    icon: '💧',
    badge: '추가미션',
    color: 'from-blue-500 to-teal-400',
  },
  {
    id: 'freeze',
    title: '캐릭터 얼리기 & 깨뜨리기',
    desc: '급속 냉각 빔으로 꽁꽁 얼린 후 쨍그랑 맑게 깨뜨리기',
    icon: '❄️',
    badge: '추가미션',
    color: 'from-cyan-500 to-sky-400',
  },
  {
    id: 'wind',
    title: '바람으로 날려보내기',
    desc: '터보 선풍기 가동! 봄바람에 실어 저 멀리 날려보내기',
    icon: '🌪️',
    badge: '추가미션',
    color: 'from-teal-500 to-emerald-400',
  },
];

export default function Step4GameSelector({
  monsterData,
  playedGames,
  onSelectGame,
  onNext,
  onPrev,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-pop">
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
          STEP 4 · 체크아웃 스트레스 해소 게임
        </span>
      </div>

      {/* Narrative Header */}
      <div className="text-center mb-6">
        <h2 className="font-game text-2xl sm:text-3xl text-white font-black mb-1">
          "어떤 활동으로 불청객을 배웅해 볼까요?"
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          마음 호텔 지배인님만의 스타일로 <strong className="text-amber-400">"{monsterData.name}"</strong>을(를) 기분 좋게 체크아웃시켜 보세요!
        </p>

        {playedGames.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>완료한 미션: {playedGames.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
        {GAME_LIST.map((game) => {
          const isPlayed = playedGames.includes(game.title);
          return (
            <div
              key={game.id}
              onClick={() => {
                playSound.click();
                onSelectGame(game.id);
              }}
              className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isPlayed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 완료
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {game.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-game text-lg text-white font-bold group-hover:text-amber-300 transition-colors mb-1">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>게임 시작하기</span>
                <Play className="w-4 h-4 fill-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Go to Step 5 Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          {playedGames.length === 0 ? (
            <p>💡 원하는 게임을 먼저 하나 이상 플레이해 보세요!</p>
          ) : (
            <p className="text-emerald-300 font-medium">
              🎉 불청객을 멋지게 다뤄보셨군요! 이제 마음을 점검하러 가볼까요?
            </p>
          )}
        </div>

        <button
          onClick={() => {
            playSound.click();
            onNext();
          }}
          disabled={playedGames.length === 0}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-game text-base font-black flex items-center justify-center gap-2 transition-all ${
            playedGames.length > 0
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>마음 되찾기 단계로 이동</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
