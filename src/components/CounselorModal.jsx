import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Trash2, Download, Search, BookOpen, Heart, Flame, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function CounselorModal({ isOpen, onClose }) {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
      fetchStats();
    }
  }, [isOpen]);

  const handleDelete = async (id) => {
    if (!window.confirm('이 기록을 삭제하시겠습니까?')) return;
    playSound.click();
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
      setRecords(prev => prev.filter(r => r.id !== id));
      fetchStats();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExportCSV = () => {
    playSound.click();
    if (records.length === 0) {
      alert('내보낼 기록이 없습니다.');
      return;
    }

    const headers = [
      '일시', '학년', '반', '이름', '고민영역', '불청객이름',
      '수행게임', '최종감정', '사전스트레스', '사후스트레스',
      '질문1_대처법', '질문2_필요한것', '질문3_나에게한말'
    ];

    const rows = records.map(r => [
      `"${new Date(r.createdAt).toLocaleString('ko-KR')}"`,
      `"${r.grade || ''}"`,
      `"${r.classNum || ''}"`,
      `"${r.studentName || ''}"`,
      `"${r.category || ''}"`,
      `"${r.monsterName || ''}"`,
      `"${(r.gamesPlayed || []).join(';')}"`,
      `"${r.finalEmotion || ''}"`,
      r.stressBefore,
      r.stressAfter,
      `"${(r.answers?.q1 || '').replace(/"/g, '""')}"`,
      `"${(r.answers?.q2 || '').replace(/"/g, '""')}"`,
      `"${(r.answers?.q3 || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `위클래스_마음호텔_기록부_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.studentName || '').toLowerCase().includes(q) ||
      (r.monsterName || '').toLowerCase().includes(q) ||
      (r.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-pop">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-game text-xl text-white font-bold">
                  위클래스 마음 호텔 상담 기록부
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  ⚡ Supabase DB 연동
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Supabase 클라우드 데이터베이스에 안전하게 보관된 학생들의 감정 외재화 및 체크아웃 기록입니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">총 체크아웃 수</span>
              <span className="text-xl font-game font-bold text-amber-400">{stats.total}회</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">주요 고민 유형</span>
              <span className="text-xs font-bold text-sky-400 truncate block">
                {Object.keys(stats.categoryCounts || {})[0] || '데이터 없음'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">가장 인기있는 게임</span>
              <span className="text-xs font-bold text-emerald-400 truncate block">
                {Object.keys(stats.gameCounts || {})[0] || '데이터 없음'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">최다 감정 변화</span>
              <span className="text-xs font-bold text-rose-400 truncate block">
                {Object.keys(stats.emotionCounts || {})[0] || '데이터 없음'}
              </span>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="학생 이름, 불청객 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                fetchRecords();
                fetchStats();
              }}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 다운로드</span>
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {loading ? '기록을 불러오는 중입니다...' : '아직 저장된 체크아웃 기록이 없습니다.'}
            </div>
          ) : (
            filteredRecords.map((r) => (
              <div
                key={r.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold text-white text-sm">
                      {r.grade ? `${r.grade}학년 ` : ''}{r.classNum ? `${r.classNum} ` : ''}{r.studentName}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-2 font-mono">
                      {new Date(r.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    title="기록 삭제"
                    className="p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">불청객</span>
                    <span className="text-rose-400 font-bold">{r.monsterName}</span>
                    <span className="text-slate-500 block text-[9px]">({r.category})</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">수행 게임</span>
                    <span className="text-emerald-400 font-medium truncate block">
                      {(r.gamesPlayed || []).join(', ') || '없음'}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">최종 감정</span>
                    <span className="text-amber-300 font-bold">{r.finalEmotion}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">스트레스 변화</span>
                    <span className="text-sky-300 font-bold">{r.stressBefore}점 ➔ {r.stressAfter}점</span>
                  </div>
                </div>

                {/* Answers */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-[11px] space-y-1">
                  {r.answers?.q1 && (
                    <p><strong className="text-slate-400">재방문 대처:</strong> <span className="text-slate-200">"{r.answers.q1}"</span></p>
                  )}
                  {r.answers?.q2 && (
                    <p><strong className="text-slate-400">필요한 것:</strong> <span className="text-slate-200">"{r.answers.q2}"</span></p>
                  )}
                  {r.answers?.q3 && (
                    <p><strong className="text-slate-400">나에게 한 말:</strong> <span className="text-yellow-200 italic">"{r.answers.q3}"</span></p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
