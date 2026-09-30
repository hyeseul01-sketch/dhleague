'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScheduleItem {
  rowIdx: number;
  group: string;
  date: string;
  match1: string;
  match2: string;
  location: string;
  note?: string;
}

export default function LeagueDashboard() {
  const [activeTab, setActiveTab] = useState<'2' | '3' | 'referee'>('2');
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B'>('A');
  const [isEditMode, setIsEditMode] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 구글 시트 API 연동
  useEffect(() => {
    if (activeTab === 'referee') return;
    
    setLoading(true);
    fetch(`/api/schedule?grade=${activeTab}&group=${selectedGroup}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setScheduleData(resData.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('데이터 조회 오류:', err);
        setLoading(false);
      });
  }, [activeTab, selectedGroup]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 헤더 및 전광판 이동 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            🏆 2026학년도 2학기 2,3학년 스포츠리그
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/netball" title="넷볼 전광판" className="p-2.5 bg-white rounded-full shadow hover:bg-gray-50 border transition text-lg">
              📺
            </Link>
            <Link href="/volleyball" title="배구 전광판" className="p-2.5 bg-white rounded-full shadow hover:bg-gray-50 border transition text-lg">
              🏐
            </Link>
          </div>
        </div>

        {/* 학년 / 심판 일정표 탭 Navigation */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setActiveTab('2')}
            className={`py-3 rounded-lg font-bold text-center transition ${activeTab === '2' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-600 border hover:bg-blue-50'}`}
          >
            2학년 (얼티미트/빅발리볼)
          </button>
          <button
            onClick={() => setActiveTab('3')}
            className={`py-3 rounded-lg font-bold text-center transition ${activeTab === '3' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-600 border hover:bg-blue-50'}`}
          >
            3학년 (풋살/넷볼)
          </button>
          <button
            onClick={() => setActiveTab('referee')}
            className={`py-3 rounded-lg font-bold text-center transition ${activeTab === 'referee' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-800 border hover:bg-slate-50'}`}
          >
            ※ 심판 일정표
          </button>
        </div>

        {/* 교사 편집 모드 스위치 */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={(e) => setIsEditMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
          <span className="text-sm font-bold text-rose-600 flex items-center gap-1">
            🔒 교사 편집 모드
          </span>
        </div>

        {/* 메인 콘텐츠 영역 */}
        {activeTab === 'referee' ? (
          <div className="bg-white p-8 rounded-xl shadow border text-center font-semibold text-gray-600">
            심판 일정표 페이지 준비 중입니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 경기 일정 및 대진표 테이블 */}
            <div className="lg:col-span-7 bg-white rounded-xl shadow border overflow-hidden">
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <span className="font-bold text-lg flex items-center gap-2">
                  📅 경기 일정 및 대진표
                </span>
                <div className="flex gap-1 bg-blue-700 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedGroup('A')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${selectedGroup === 'A' ? 'bg-white text-blue-700' : 'text-white'}`}
                  >
                    A조
                  </button>
                  <button
                    onClick={() => setSelectedGroup('B')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${selectedGroup === 'B' ? 'bg-white text-blue-700' : 'text-white'}`}
                  >
                    B조
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12 text-gray-500 font-semibold">대진표 로딩 중...</div>
                ) : (
                  <table className="w-full text-center border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-gray-600 font-bold">
                        <th className="p-3 border">일자</th>
                        <th className="p-3 border">{activeTab === '2' ? '얼티미트 (남)' : '풋살 (남)'}</th>
                        <th className="p-3 border">{activeTab === '2' ? '빅발리볼 (여)' : '넷볼 (여)'}</th>
                        <th className="p-3 border">장소</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((item) => (
                        <tr key={item.rowIdx} className="border-b hover:bg-gray-50 transition">
                          <td className="p-3 border font-medium text-gray-600">{item.date}</td>
                          <td className="p-3 border">
                            <span className="inline-block px-3 py-1 bg-cyan-500 text-white font-bold rounded-full text-xs shadow-sm">
                              {item.match1}
                            </span>
                          </td>
                          <td className="p-3 border">
                            <span className="inline-block px-3 py-1 bg-amber-500 text-white font-bold rounded-full text-xs shadow-sm">
                              {item.match2}
                            </span>
                          </td>
                          <td className="p-3 border text-gray-600 font-medium">{item.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* 실시간 순위표 영역 */}
            <div className="lg:col-span-5 bg-white rounded-xl shadow border overflow-hidden">
              <div className="bg-emerald-700 text-white p-4 font-bold text-lg flex items-center gap-2">
                📊 {selectedGroup}조 실시간 순위표
              </div>
              <div className="p-4 flex flex-col gap-6">
                <div>
                  <h3 className="font-bold text-emerald-800 mb-2">{activeTab === '2' ? '빅발리볼' : '넷볼'}</h3>
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="bg-emerald-50 border-b text-gray-600">
                        <th className="p-2 border">순위</th>
                        <th className="p-2 border">팀</th>
                        <th className="p-2 border">경기</th>
                        <th className="p-2 border">승무패</th>
                        <th className="p-2 border">득실</th>
                        <th className="p-2 border">승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 border font-bold">1</td>
                        <td className="p-2 border">6반</td>
                        <td className="p-2 border">1</td>
                        <td className="p-2 border">1/0/0</td>
                        <td className="p-2 border text-emerald-600 font-bold">+2</td>
                        <td className="p-2 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 border font-bold">2</td>
                        <td className="p-2 border">3반</td>
                        <td className="p-2 border">1</td>
                        <td className="p-2 border">1/0/0</td>
                        <td className="p-2 border text-emerald-600 font-bold">+1</td>
                        <td className="p-2 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}