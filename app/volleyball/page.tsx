'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VolleyballScoreboard() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setA, setSetA] = useState(0);
  const [setB, setSetB] = useState(0);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-between">
      {/* 상단 헤더 및 네비게이션 */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <Link href="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition">
          📋 리그 대진표로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-amber-400">🏐 배구 전광판</h1>
        <div className="w-24"></div>
      </div>

      {/* 스코어보드 메인 */}
      <div className="w-full max-w-5xl grid grid-cols-2 gap-8 my-auto">
        {/* TEAM A */}
        <div className="bg-slate-800 border-2 border-red-500 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
          <h2 className="text-4xl font-extrabold text-red-400 mb-4">TEAM A</h2>
          <div className="text-2xl mb-4 font-semibold text-slate-300">획득 세트: {setA}</div>
          <div className="text-9xl font-black my-6 tracking-tighter">{scoreA}</div>
          <div className="flex gap-4 w-full">
            <button onClick={() => setScoreA(prev => Math.max(0, prev - 1))} className="flex-1 py-4 bg-slate-700 text-2xl font-bold rounded-xl active:scale-95">-1</button>
            <button onClick={() => setScoreA(prev => prev + 1)} className="flex-2 py-4 bg-red-600 hover:bg-red-500 text-3xl font-bold rounded-xl active:scale-95">+1</button>
          </div>
          <button onClick={() => setSetA(prev => prev + 1)} className="w-full mt-4 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 text-sm rounded-lg">세트 승리 추가</button>
        </div>

        {/* TEAM B */}
        <div className="bg-slate-800 border-2 border-blue-500 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
          <h2 className="text-4xl font-extrabold text-blue-400 mb-4">TEAM B</h2>
          <div className="text-2xl mb-4 font-semibold text-slate-300">획득 세트: {setB}</div>
          <div className="text-9xl font-black my-6 tracking-tighter">{scoreB}</div>
          <div className="flex gap-4 w-full">
            <button onClick={() => setScoreB(prev => Math.max(0, prev - 1))} className="flex-1 py-4 bg-slate-700 text-2xl font-bold rounded-xl active:scale-95">-1</button>
            <button onClick={() => setScoreB(prev => prev + 1)} className="flex-2 py-4 bg-blue-600 hover:bg-blue-500 text-3xl font-bold rounded-xl active:scale-95">+1</button>
          </div>
          <button onClick={() => setSetB(prev => prev + 1)} className="w-full mt-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-500/50 text-sm rounded-lg">세트 승리 추가</button>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-4 mt-8">
        <button onClick={() => { setScoreA(0); setScoreB(0); }} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold">점수 리셋</button>
        <button onClick={() => { setScoreA(0); setScoreB(0); setSetA(0); setSetB(0); }} className="px-6 py-3 bg-rose-700 hover:bg-rose-600 rounded-xl font-bold">전체 리셋</button>
      </div>
    </div>
  );
}