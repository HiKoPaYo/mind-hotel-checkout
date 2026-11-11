import React, { useState } from 'react';
import Header from './components/Header';
import Step1Start from './components/steps/Step1Start';
import Step2CreateMonster from './components/steps/Step2CreateMonster';
import Step3Interact from './components/steps/Step3Interact';
import Step4GameSelector from './components/steps/Step4GameSelector';
import Step5Reflect from './components/steps/Step5Reflect';
import Step6RoomStatus from './components/steps/Step6RoomStatus';
import CounselorModal from './components/CounselorModal';

// Games
import BaseballGame from './components/games/BaseballGame';
import SoccerGame from './components/games/SoccerGame';
import MunchGame from './components/games/MunchGame';
import BalloonGame from './components/games/BalloonGame';
import ShredderGame from './components/games/ShredderGame';
import VacuumGame from './components/games/VacuumGame';
import WaterBalloonGame from './components/games/WaterBalloonGame';
import FreezeGame from './components/games/FreezeGame';
import WindGame from './components/games/WindGame';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1); // 1 to 6
  const [activeGameId, setActiveGameId] = useState(null); // null or game id
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);

  // Student (Manager) Profile
  const [managerInfo, setManagerInfo] = useState({
    grade: '1',
    classNum: '1반',
    name: '',
  });

  // Problem & Monster Customization
  const [monsterData, setMonsterData] = useState({
    category: '시험 불안',
    name: '시험 괴물',
    shape: 'cloud',
    color: 'purple',
    eyes: 'glare',
    mouth: 'zigzag',
    size: 1,
  });

  // Stress Level (Before & After)
  const [stressBefore, setStressBefore] = useState(7);
  const [stressAfter, setStressAfter] = useState(2);

  // Played Games
  const [playedGames, setPlayedGames] = useState([]);

  // Final Reflection
  const [finalEmotion, setFinalEmotion] = useState('');
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
  });

  // Reset to Beginning
  const handleReset = () => {
    setCurrentStep(1);
    setActiveGameId(null);
    setPlayedGames([]);
    setFinalEmotion('');
    setAnswers({ q1: '', q2: '', q3: '' });
    setStressBefore(7);
    setStressAfter(2);
  };

  // Complete a game
  const handleGameComplete = (gameTitle) => {
    if (!playedGames.includes(gameTitle)) {
      setPlayedGames(prev => [...prev, gameTitle]);
    }
    setActiveGameId(null);
  };

  // Save to Server API on moving to Step 6
  const saveRecordToServer = async () => {
    try {
      const payload = {
        grade: managerInfo.grade,
        classNum: managerInfo.classNum,
        studentName: managerInfo.name,
        category: monsterData.category,
        monsterName: monsterData.name,
        monsterConfig: {
          shape: monsterData.shape,
          color: monsterData.color,
          eyes: monsterData.eyes,
          mouth: monsterData.mouth,
        },
        gamesPlayed: playedGames,
        finalEmotion,
        answers,
        stressBefore,
        stressAfter,
      };

      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Failed to save to server:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <Header
        managerInfo={managerInfo}
        currentStep={currentStep}
        onReset={handleReset}
        onOpenCounselor={() => setIsCounselorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-4 px-2 w-full">
        {/* If Active Game is selected, show Game Screen */}
        {activeGameId ? (
          <div className="w-full animate-pop">
            {activeGameId === 'baseball' && (
              <BaseballGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'soccer' && (
              <SoccerGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'munch' && (
              <MunchGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'balloon' && (
              <BalloonGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'shredder' && (
              <ShredderGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'vacuum' && (
              <VacuumGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'water' && (
              <WaterBalloonGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'freeze' && (
              <FreezeGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'wind' && (
              <WindGame
                monsterData={monsterData}
                onComplete={handleGameComplete}
                onExit={() => setActiveGameId(null)}
              />
            )}
          </div>
        ) : (
          <>
            {/* Step 1: Start */}
            {currentStep === 1 && (
              <Step1Start
                managerInfo={managerInfo}
                setManagerInfo={setManagerInfo}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {/* Step 2: Create Monster */}
            {currentStep === 2 && (
              <Step2CreateMonster
                monsterData={monsterData}
                setMonsterData={setMonsterData}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}

            {/* Step 3: Interaction & Externalization */}
            {currentStep === 3 && (
              <Step3Interact
                monsterData={monsterData}
                stressBefore={stressBefore}
                setStressBefore={setStressBefore}
                onNext={() => setCurrentStep(4)}
                onPrev={() => setCurrentStep(2)}
              />
            )}

            {/* Step 4: Choose Stress Relief Games */}
            {currentStep === 4 && (
              <Step4GameSelector
                monsterData={monsterData}
                playedGames={playedGames}
                onSelectGame={(id) => setActiveGameId(id)}
                onNext={() => setCurrentStep(5)}
                onPrev={() => setCurrentStep(3)}
              />
            )}

            {/* Step 5: Reflection */}
            {currentStep === 5 && (
              <Step5Reflect
                monsterData={monsterData}
                stressBefore={stressBefore}
                stressAfter={stressAfter}
                setStressAfter={setStressAfter}
                finalEmotion={finalEmotion}
                setFinalEmotion={setFinalEmotion}
                answers={answers}
                setAnswers={setAnswers}
                onNext={async () => {
                  await saveRecordToServer();
                  setCurrentStep(6);
                }}
                onPrev={() => setCurrentStep(4)}
              />
            )}

            {/* Step 6: Room Status & Certificate */}
            {currentStep === 6 && (
              <Step6RoomStatus
                managerInfo={managerInfo}
                monsterData={monsterData}
                playedGames={playedGames}
                finalEmotion={finalEmotion}
                answers={answers}
                stressBefore={stressBefore}
                stressAfter={stressAfter}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Counselor Modal */}
      <CounselorModal
        isOpen={isCounselorOpen}
        onClose={() => setIsCounselorOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center text-slate-500 text-xs border-t border-slate-800/80">
        <p>
          마음 타파! - 불청객의 체크아웃 · 중학생 감정 외재화 인터랙티브 심리 게임 앱
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          "내가 문제가 아니라, 나를 힘들게 하는 문제가 찾아왔을 뿐입니다." · 위클래스 상담실 연동
        </p>
      </footer>
    </div>
  );
}
