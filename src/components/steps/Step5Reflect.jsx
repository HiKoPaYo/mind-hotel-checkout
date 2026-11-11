import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Sparkles, MessageSquareHeart, ShieldCheck } from 'lucide-react';
import { playSound } from '../../utils/sound';

const EMOTION_OPTIONS = [
  { id: 'lighter', label: '조금 가벼워졌어요.', icon: '🕊️', desc: '마음의 짐이 한결 덜어진 기분이에요.' },
  { id: 'fun', label: '재미있었어요.', icon: '😆', desc: '게임을 하면서 웃고 신나게 날려보냈어요.' },
  { id: 'still_sad', label: '여전히 속상해요.', icon: '💧', desc: '아직 마음 한구석이 찌릿하고 아파요.' },
  { id: 'still_worried', label: '아직 걱정돼요.', icon: '💭', desc: '생각이 완전히 떠나지는 않았어요.' },
  { id: 'confused', label: '잘 모르겠어요.', icon: '🤔', desc: '어떤 느낌인지 아직 헷갈리고 복잡해요.' },
];

const QUICK_NEEDS = [
  '따뜻한 휴식과 잠', '맛있는 간식 먹기', '친한 친구와의 수다',
  '좋아하는 음악 듣기', '심호흡 3번 하기', '상담 선생님과의 대화',
];

export default function Step5Reflect({
  monsterData,
  stressBefore,
  stressAfter,
  setStressAfter,
  finalEmotion,
  setFinalEmotion,
  answers,
  setAnswers,
  onNext,
  onPrev,
}) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!finalEmotion) {
      setErrorMsg('지금 느끼는 감정을 하나 선택해 주세요!');
      return;
    }
    setErrorMsg('');
    playSound.click();
    onNext();
  };

  const selectedEmotionObj = EMOTION_OPTIONS.find(e => e.label === finalEmotion);

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
          STEP 5 · 마음 되찾기 & 회고
        </span>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6">
        <h2 className="font-game text-2xl sm:text-3xl text-white font-black mb-1">
          "불청객을 다뤄보니 어때요?"
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          정해진 정답은 없어요. 지금 내 마음에 떠오른 솔직한 감정을 골라주세요.
        </p>
      </div>

      {/* Emotion Selection */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-xl mb-6">
        <label className="block text-xs font-semibold text-amber-300 mb-3 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>지금 내 마음의 상태는?</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {EMOTION_OPTIONS.map((emo) => {
            const isSelected = finalEmotion === emo.label;
            return (
              <button
                key={emo.id}
                type="button"
                onClick={() => {
                  playSound.click();
                  setFinalEmotion(emo.label);
                  if (errorMsg) setErrorMsg('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-2xl">{emo.icon}</span>
                <div>
                  <div className="text-sm font-bold">{emo.label}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{emo.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Emotion Validation Banner */}
        {selectedEmotionObj && (
          <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-4 text-xs text-indigo-200 leading-relaxed animate-pop">
            💙 <strong>소중한 감정의 인정:</strong> {selectedEmotionObj.label === '여전히 속상해요.' || selectedEmotionObj.label === '아직 걱정돼요.'
              ? '여전히 걱정되거나 속상해도 아주 자연스러운 일이에요. 문제를 없애는 것보다, "내가 그 문제와 마주할 수 있었다"는 사실 자체가 큰 힘이 됩니다.'
              : '불청객과 심리적 거리를 두면서 내 마음의 주인이 나 자신임을 확인하셨네요!'}
          </div>
        )}

        {/* Post-Stress Level Slider */}
        <div className="mt-6 pt-5 border-t border-slate-700">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-slate-300">
              현재 남은 스트레스 지수는 어떤가요? (활동 전: <strong className="text-rose-400">{stressBefore}점</strong>)
            </span>
            <span className="text-base font-game font-bold text-amber-400">
              {stressAfter} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stressAfter}
            onChange={(e) => setStressAfter(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 (매우 평온함)</span>
            <span>5 (보통)</span>
            <span>10 (여전히 벅참)</span>
          </div>
        </div>
      </div>

      {/* 3 Reflection Questions */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 mb-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
          <MessageSquareHeart className="w-5 h-5 text-amber-400" />
          <h3 className="font-game text-lg text-white font-bold">마음 호텔 지배인의 질문 3가지</h3>
        </div>

        {/* Question 1 */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            1. 불청객("{monsterData.name}")이 다시 찾아온다면 어떻게 해볼까요?
          </label>
          <input
            type="text"
            placeholder="예: '너 또 왔구나? 하지만 넌 내 마음을 다 차지할 수 없어'라고 말해줄래요."
            value={answers.q1}
            onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            2. 지금 나에게 가장 필요한 것은 무엇인가요?
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {QUICK_NEEDS.map((need, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playSound.click();
                  setAnswers({ ...answers, q2: need });
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  answers.q2 === need
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                + {need}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="직접 입력하거나 위의 칩을 눌러보세요"
            value={answers.q2}
            onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            3. 지배인(나 자신)에게 해주고 싶은 말은 무엇인가요?
          </label>
          <input
            type="text"
            placeholder="예: 오늘 하루도 정말 수고 많았어. 넌 언제나 너만의 속도로 잘 해내고 있어!"
            value={answers.q3}
            onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Core Narrative Ending Quote */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center">
        <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
        <p className="font-game text-base sm:text-lg text-amber-200 font-bold leading-relaxed">
          "불청객이 다시 찾아와도 괜찮아요.<br />
          나는 나만의 방법으로 문제를 다룰 수 있으니까요."
        </p>
      </div>

      {errorMsg && (
        <p className="text-rose-400 text-xs font-semibold mb-4 text-center bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game text-lg font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>체크아웃 완료! 룸 상태 확인하기</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
