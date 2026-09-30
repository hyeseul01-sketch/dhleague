'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NetballScoreboard() {
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(720); // 12분 (720초)
  const [isRunning, setIsRunning] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [foulA, setFoulA] = useState(0);
  const [foulB, setFoulB] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex flex-col justify-between select-none">
      {/* 상단 컨트롤 바 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Link href="/" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-semibold border border-slate-700">
            📋 리그 대진표
          </Link>
        </div>
        <div className="text-xs text-slate-400">made by. 한태건 T</div>
      </div>

      {/* 타이머 & 쿼터 영역 */}
      <div className="flex flex-col items-center my-4">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={() => setQuarter((prev) => Math.max(1, prev - 1))} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-lg">&lt;</button>
          <span className="text-5xl font-extrabold text-amber-400 tracking-wider">{quarter} Quarter</span>
          <button onClick={() => setQuarter((prev) => prev + 1)} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-lg">&gt;</button>
        </div>

        <div className="text-[120px] leading-none font-black tracking-tight my-2 font-mono drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* 스코어보드 메인 */}
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto w-full items-center">
        {/* TEAM A */}
        <div className="col-span-5 bg-slate-900/80 border-2 border-red-500/80 rounded-2xl p-6 flex flex-col items-center shadow-xl">
          <h2 className="text-4xl font-extrabold text-red-500 mb-2">TEAM A</h2>
          <div className="flex items-center gap-2 mb-4 bg-slate-800 px-4 py-1 rounded-full border border-amber-500/30">
            <span className="text-amber-400 text-sm font-bold">팀 경고:</span>
            <button onClick={() => setFoulA((prev) => Math.max(0, prev - 1))} className="w-6 h-6 bg-slate-700 rounded font-bold text-xs">-</button>
            <span className="text-xl font-bold px-1">{foulA}</span>
            <button onClick={() => setFoulA((prev) => prev + 1)} className="w-6 h-6 bg-amber-600 rounded font-bold text-xs">+</button>
          </div>
          <div className="text-9xl font-black my-4 text-white font-mono">{scoreA}</div>
          <div className="flex gap-3 w-full">
            <button onClick={() => setScoreA((prev) => Math.max(0, prev - 1))} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-xl font-bold rounded-xl border border-slate-700">-1</button>
            <button onClick={() => setScoreA((prev) => prev + 1)} className="flex-2 py-3 bg-red-600 hover:bg-red-500 text-2xl font-bold rounded-xl active:scale-95">+1</button>
          </div>
        </div>

        {/* 중앙 컨트롤 버튼 */}
        <div className="col-span-2 flex flex-col gap-3">
          <button onClick={() => setIsRunning(!isRunning)} className={`py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
            {isRunning ? '일시정지' : '시작'}
          </button>
          <button onClick={() => { setIsRunning(false); setTimeLeft(720); }} className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold border border-slate-700">시간 초기화</button>
          <button onClick={() => { setScoreA(0); setScoreB(0); }} className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold border border-slate-700">점수 초기화</button>
          <button onClick={() => { setFoulA(0); setFoulB(0); }} className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold border border-slate-700">선수 초기화</button>
        </div>

        {/* TEAM B */}
        <div className="col-span-5 bg-slate-900/80 border-2 border-blue-500/80 rounded-2xl p-6 flex flex-col items-center shadow-xl">
          <h2 className="text-4xl font-extrabold text-blue-500 mb-2">TEAM B</h2>
          <div className="flex items-center gap-2 mb-4 bg-slate-800 px-4 py-1 rounded-full border border-amber-500/30">
            <span className="text-amber-400 text-sm font-bold">팀 경고:</span>
            <button onClick={() => setFoulB((prev) => Math.max(0, prev - 1))} className="w-6 h-6 bg-slate-700 rounded font-bold text-xs">-</button>
            <span className="text-xl font-bold px-1">{foulB}</span>
            <button onClick={() => setFoulB((prev) => prev + 1)} className="w-6 h-6 bg-amber-600 rounded font-bold text-xs">+</button>
          </div>
          <div className="text-9xl font-black my-4 text-white font-mono">{scoreB}</div>
          <div className="flex gap-3 w-full">
            <button onClick={() => setScoreB((prev) => Math.max(0, prev - 1))} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-xl font-bold rounded-xl border border-slate-700">-1</button>
            <button onClick={() => setScoreB((prev) => prev + 1)} className="flex-2 py-3 bg-blue-600 hover:bg-blue-500 text-2xl font-bold rounded-xl active:scale-95">+1</button>
          </div>
        </div>
      </div>

      <div className="h-4"></div>
    </div>
  );
}