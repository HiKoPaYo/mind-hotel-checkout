import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Wand2, Palette, Sparkles, Sliders } from 'lucide-react';
import MonsterCharacter, {
  MONSTER_SHAPES,
  MONSTER_COLORS,
  MONSTER_EYES,
  MONSTER_MOUTHS,
} from '../MonsterCharacter';
import { playSound } from '../../utils/sound';

const DEFAULT_PROBLEMS = [
  { id: 'exam', label: '시험 불안', defaultName: '시험 괴물', icon: '📝', defShape: 'cloud', defColor: 'purple' },
  { id: 'friend', label: '친구 관계', defaultName: '눈치 대장', icon: '👥', defShape: 'slime', defColor: 'green' },
  { id: 'look', label: '외모 고민', defaultName: '거울 악동', icon: '🪞', defShape: 'furry', defColor: 'pink' },
  { id: 'grade', label: '성적 스트레스', defaultName: '성적 사냥꾼', icon: '📈', defShape: 'horn', defColor: 'red' },
  { id: 'parent', label: '부모님과의 갈등', defaultName: '잔소리 폭탄', icon: '⚡', defShape: 'spiky', defColor: 'orange' },
  { id: 'teacher', label: '선생님과의 갈등', defaultName: '눈총 도깨비', icon: '👨‍🏫', defShape: 'horn', defColor: 'red' },
  { id: 'future', label: '미래에 대한 걱정', defaultName: '걱정 먹구름', icon: '🌪️', defShape: 'cloud', defColor: 'gray' },
  { id: 'compare', label: '비교하는 마음', defaultName: '질투 가시', icon: '🌵', defShape: 'spiky', defColor: 'purple' },
  { id: 'lonely', label: '외로움', defaultName: '그림자 유령', icon: '🌑', defShape: 'slime', defColor: 'blue' },
  { id: 'anger', label: '분노', defaultName: '활활 불꽃이', icon: '🔥', defShape: 'spiky', defColor: 'red' },
  { id: 'lethargy', label: '무기력', defaultName: '축 늘어진 젤리', icon: '🪨', defShape: 'slime', defColor: 'blue' },
  { id: 'custom', label: '기타 직접 입력', defaultName: '마음 불청객', icon: '✨', defShape: 'slime', defColor: 'purple' },
];

export default function Step2CreateMonster({ monsterData, setMonsterData, onNext, onPrev }) {
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'customize'

  const handleSelectProblem = (item) => {
    playSound.click();
    const isCustom = item.id === 'custom';
    setMonsterData(prev => ({
      ...prev,
      category: isCustom ? '' : item.label,
      name: item.defaultName,
      shape: item.defShape || prev.shape,
      color: item.defColor || prev.color,
    }));
  };

  const handleNext = () => {
    if (!monsterData.name || monsterData.name.trim() === '') {
      alert('불청객의 이름을 지어주세요!');
      return;
    }
    playSound.click();
    onNext();
  };

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
          STEP 2 · 불청객 만들기
        </span>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="font-game text-2xl sm:text-3xl text-white font-black mb-1">
          "오늘 체크인한 불청객은 누구인가요?"
        </h2>
        <p className="text-slate-400 text-sm">
          나를 힘들게 하는 문제의 이름을 붙이고, 귀여운 불청객 캐릭터로 시각화해 보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Monster Preview */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          {/* Room background glow */}
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Name Tag */}
          <div className="z-10 mb-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/50 shadow-md">
            <span className="font-game text-lg text-amber-300 font-bold">
              {monsterData.name || '이름 없음'}
            </span>
          </div>

          <p className="z-10 text-xs text-slate-400 mb-4">
            유형: <span className="text-slate-200 font-semibold">{monsterData.category || '직접 입력'}</span>
          </p>

          {/* Character */}
          <div className="z-10 my-2">
            <MonsterCharacter
              config={{
                shape: monsterData.shape,
                color: monsterData.color,
                eyes: monsterData.eyes,
                mouth: monsterData.mouth,
              }}
              size={180 * (monsterData.size || 1)}
              className="animate-float"
            />
          </div>

          <p className="z-10 text-xs text-amber-300/80 mt-4 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            💡 "이제 문제와 내가 분리되어 보이나요?"
          </p>
        </div>

        {/* Right Column: Problem Select & Customization */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-900 p-1 mb-5">
            <button
              onClick={() => {
                playSound.click();
                setActiveTab('problem');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'problem'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>1. 문제 선택 & 이름</span>
            </button>
            <button
              onClick={() => {
                playSound.click();
                setActiveTab('customize');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'customize'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. 모습 꾸미기</span>
            </button>
          </div>

          {/* Tab 1: Problems */}
          {activeTab === 'problem' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  지금 나를 가장 힘들게 하는 고민은?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEFAULT_PROBLEMS.map((item) => {
                    const isSelected = monsterData.category === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectProblem(item)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white font-bold ring-2 ring-amber-400/40'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Problem Input if custom or edit */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  고민 직접 적기 (선택 사항)
                </label>
                <input
                  type="text"
                  placeholder="예: 조별 과제 스트레스, 진로 고민 등"
                  value={monsterData.category}
                  onChange={(e) => setMonsterData({ ...monsterData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Monster Name Input */}
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>불청객 이름 붙이기 (외재화)</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 시험 괴물, 눈치 대장, 성적 사냥꾼 등"
                  value={monsterData.name}
                  onChange={(e) => setMonsterData({ ...monsterData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-amber-400/60 text-white text-base font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 문제에 이름을 붙여주면, 나와 문제를 분리해서 바라볼 수 있어요!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setActiveTab('customize');
                }}
                className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-all mt-2"
              >
                <span>모습 꾸미기로 넘어가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tab 2: Customization */}
          {activeTab === 'customize' && (
            <div className="space-y-4">
              {/* Shape */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">체형 선택</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MONSTER_SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        playSound.click();
                        setMonsterData({ ...monsterData, shape: s.id });
                      }}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        monsterData.shape === s.id
                          ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{s.icon}</div>
                      <div className="text-[10px] truncate">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">색상 선택</label>
                <div className="flex flex-wrap gap-2">
                  {MONSTER_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        playSound.click();
                        setMonsterData({ ...monsterData, color: c.id });
                      }}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        monsterData.color === c.id
                          ? 'scale-115 border-white ring-2 ring-amber-400'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Eyes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">눈 모양</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MONSTER_EYES.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        playSound.click();
                        setMonsterData({ ...monsterData, eyes: e.id });
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs text-center transition-all ${
                        monsterData.eyes === e.id
                          ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mouth */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">입 모양</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MONSTER_MOUTHS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playSound.click();
                        setMonsterData({ ...monsterData, mouth: m.id });
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs text-center transition-all ${
                        monsterData.mouth === m.id
                          ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>불청객의 덩치 (체감 크기)</span>
                  <span className="text-amber-400 font-bold">{Math.round((monsterData.size || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={monsterData.size || 1}
                  onChange={(e) => setMonsterData({ ...monsterData, size: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* Confirm & Go Next */}
          <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-game text-lg font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>불청객과 마주하기 (다음 단계)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
