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

interface RefereeItem {
  rowIdx?: number;
  date: string;
  time: string;
  sport: string;
  match: string;
  referee: string;
  location: string;
  note?: string;
}

export default function LeagueDashboard() {
  const [activeTab, setActiveTab] = useState<'2' | '3' | 'referee'>('2');
  const [refereeGrade, setRefereeGrade] = useState<'2' | '3'>('2'); // 심판 일정표 전용 학년 탭
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B'>('A');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [refereeData, setRefereeData] = useState<RefereeItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 교사 편집 모드 비밀번호 인증 (2607)
  const handleToggleEditMode = () => {
    if (!isEditMode) {
      const password = prompt('교사 편집 모드 비밀번호를 입력하세요:');
      if (password === '2607') {
        setIsEditMode(true);
      } else if (password !== null) {
        alert('비밀번호가 올바르지 않습니다.');
      }
    } else {
      setIsEditMode(false);
    }
  };

  // 백엔드 API 연동
  useEffect(() => {
    setLoading(true);
    
    if (activeTab === 'referee') {
      // 심판 일정표 데이터 불러오기 (2학년/3학년 구분)
      fetch(`/api/schedule?type=referee&grade=${refereeGrade}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            setRefereeData(resData.data || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('심판 데이터 조회 오류:', err);
          setLoading(false);
        });
    } else {
      // 학년별/조별 대진표 불러오기
      fetch(`/api/schedule?grade=${activeTab}&group=${selectedGroup}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            setScheduleData(resData.data || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('대진표 데이터 조회 오류:', err);
          setLoading(false);
        });
    }
  }, [activeTab, selectedGroup, refereeGrade]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 헤더 & 전광판 이동 버튼 */}
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
        <div className="grid grid-cols-3 gap-2 mb-4">
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

        {/* 교사 편집 모드 스위치 및 전용 관리 버튼 */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex gap-2">
            {isEditMode && (
              <>
                <button className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-emerald-600 text-emerald-700 font-bold rounded-lg text-sm flex items-center gap-1 shadow-sm">
                  👥 선수 명단 직접 등록/수정
                </button>
                <button className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-purple-600 text-purple-700 font-bold rounded-lg text-sm flex items-center gap-1 shadow-sm">
                  ➕ 심판 일정 추가
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleToggleEditMode}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-sm transition ${isEditMode ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <div className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-white' : 'bg-gray-400'}`}></div>
              {isEditMode ? '🔒 교사 편집 모드 ON' : '🔒 교사 편집 모드'}
            </button>
          </div>
        </div>

        {/* 엑셀 업로드 패널 (편집 모드 활성화 시) */}
        {isEditMode && activeTab !== 'referee' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="font-bold text-blue-900 mb-2 flex items-center gap-1 text-sm">
              📁 경기 일정 / 대진표 엑셀 업로드
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-sm font-semibold">
                <option>A조</option>
                <option>B조</option>
              </select>
              <input type="file" className="border border-gray-300 rounded px-3 py-1 bg-white text-sm" />
              <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm shadow-sm">
                대진표 업로드
              </button>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        {activeTab === 'referee' ? (
          /* --- 경기 심판 배정 일정표 (두 번째 사진 동일 스타일) --- */
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <span className="font-bold text-lg flex items-center gap-2">
                ※ 경기 심판 배정 일정표
              </span>
              <div className="flex gap-1 bg-slate-700 p-1 rounded-lg">
                <button
                  onClick={() => setRefereeGrade('2')}
                  className={`px-3 py-1 rounded text-sm font-bold transition ${refereeGrade === '2' ? 'bg-slate-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                >
                  2학년 심판 일정
                </button>
                <button
                  onClick={() => setRefereeGrade('3')}
                  className={`px-3 py-1 rounded text-sm font-bold transition ${refereeGrade === '3' ? 'bg-slate-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                >
                  3학년 심판 일정
                </button>
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              {loading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">심판 일정을 불러오는 중입니다...</div>
              ) : (
                <table className="w-full text-center border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold border-b border-slate-700">
                      <th className="p-3 border border-slate-700">일자</th>
                      <th className="p-3 border border-slate-700">시간</th>
                      <th className="p-3 border border-slate-700">종목</th>
                      <th className="p-3 border border-slate-700">대진</th>
                      <th className="p-3 border border-slate-700">심판</th>
                      <th className="p-3 border border-slate-700">장소</th>
                      <th className="p-3 border border-slate-700">비고</th>
                      {isEditMode && <th className="p-3 border border-slate-700">관리</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {refereeData.length === 0 ? (
                      <tr>
                        <td colSpan={isEditMode ? 8 : 7} className="p-8 text-center text-gray-500">
                          등록된 심판 배정 데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      refereeData.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="p-3 border font-bold text-gray-800">{item.date}</td>
                          <td className="p-3 border text-gray-600 font-medium">{item.time}</td>
                          <td className="p-3 border font-bold text-gray-700">{item.sport}</td>
                          <td className="p-3 border font-bold text-gray-900">{item.match}</td>
                          <td className="p-3 border">
                            <span className="inline-block px-3 py-1 bg-emerald-700 text-white font-bold rounded-md text-xs shadow-sm">
                              {item.referee}
                            </span>
                          </td>
                          <td className="p-3 border text-gray-600 font-medium">{item.location}</td>
                          <td className="p-3 border text-gray-500">{item.note || ''}</td>
                          {isEditMode && (
                            <td className="p-3 border">
                              <div className="flex gap-1 justify-center">
                                <button className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 font-bold text-xs rounded">
                                  수정
                                </button>
                                <button className="px-2 py-0.5 bg-white hover:bg-rose-50 border border-rose-500 text-rose-600 font-bold text-xs rounded">
                                  삭제
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          /* --- 대진표 및 실시간 순위표 화면 --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 경기 일정 및 대진표 */}
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
                        {isEditMode && <th className="p-3 border">관리</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((item) => (
                        <tr key={item.rowIdx} className="border-b hover:bg-gray-50 transition">
                          <td className="p-3 border font-medium text-gray-600">{item.date}</td>
                          <td className="p-3 border">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="inline-block px-3 py-1 bg-cyan-500 text-white font-bold rounded-full text-xs shadow-sm">
                                {item.match1}
                              </span>
                              {isEditMode && (
                                <div className="flex flex-col gap-1 w-full max-w-[130px]">
                                  <button className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] rounded">
                                    👥 출전선수등록
                                  </button>
                                  <button className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-bold text-[11px] rounded">
                                    📝 결과입력
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 border">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="inline-block px-3 py-1 bg-amber-500 text-white font-bold rounded-full text-xs shadow-sm">
                                {item.match2}
                              </span>
                              {isEditMode && (
                                <div className="flex flex-col gap-1 w-full max-w-[130px]">
                                  <button className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] rounded">
                                    👥 출전선수등록
                                  </button>
                                  <button className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold text-[11px] rounded">
                                    📝 결과입력
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 border text-gray-600 font-medium">{item.location}</td>
                          {isEditMode && (
                            <td className="p-3 border">
                              <div className="flex gap-1 justify-center">
                                <button className="px-2 py-1 bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 font-bold text-xs rounded">
                                  날짜수정
                                </button>
                                <button className="px-2 py-1 bg-white hover:bg-rose-50 border border-rose-500 text-rose-600 font-bold text-xs rounded">
                                  삭제
                                </button>
                              </div>
                            </td>
                          )}
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
                {/* 여학생 종목 순위표 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-emerald-800">{activeTab === '2' ? '빅발리볼' : '넷볼'}</h3>
                    <span className="text-[11px] text-gray-500">(승3 | 무1 | 패0 | 경고 5회당 -1점)</span>
                  </div>
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="bg-emerald-50 border-b text-gray-600 font-semibold">
                        <th className="p-1.5 border">순위</th>
                        <th className="p-1.5 border">팀</th>
                        <th className="p-1.5 border">경기</th>
                        <th className="p-1.5 border">승무패</th>
                        <th className="p-1.5 border">득실</th>
                        <th className="p-1.5 border">🟨</th>
                        <th className="p-1.5 border">승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-1.5 border font-bold">1</td>
                        <td className="p-1.5 border">6반</td>
                        <td className="p-1.5 border">1</td>
                        <td className="p-1.5 border">1/0/0</td>
                        <td className="p-1.5 border font-bold text-emerald-600">+2</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-1.5 border font-bold">2</td>
                        <td className="p-1.5 border">3반</td>
                        <td className="p-1.5 border">1</td>
                        <td className="p-1.5 border">1/0/0</td>
                        <td className="p-1.5 border font-bold text-emerald-600">+1</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 남학생 종목 순위표 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-blue-800">{activeTab === '2' ? '얼티미트' : '풋살'}</h3>
                    <span className="text-[11px] text-gray-500">(승3 | 무1 | 패0 | 경고 5회당 -1점)</span>
                  </div>
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="bg-blue-50 border-b text-gray-600 font-semibold">
                        <th className="p-1.5 border">순위</th>
                        <th className="p-1.5 border">팀</th>
                        <th className="p-1.5 border">경기</th>
                        <th className="p-1.5 border">승무패</th>
                        <th className="p-1.5 border">득실</th>
                        <th className="p-1.5 border">🟨</th>
                        <th className="p-1.5 border">승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-1.5 border font-bold">1</td>
                        <td className="p-1.5 border">3반</td>
                        <td className="p-1.5 border">1</td>
                        <td className="p-1.5 border">1/0/0</td>
                        <td className="p-1.5 border font-bold text-blue-600">+9</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-1.5 border font-bold">2</td>
                        <td className="p-1.5 border">2반</td>
                        <td className="p-1.5 border">1</td>
                        <td className="p-1.5 border">1/0/0</td>
                        <td className="p-1.5 border font-bold text-blue-600">+6</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 종합 순위표 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-amber-800 flex items-center gap-1">🏆 종합 (종목 합산)</h3>
                    <span className="text-[11px] text-gray-500">(승3 | 무1 | 패0 | 경고 5회당 -1점)</span>
                  </div>
                  <table className="w-full text-center border-collapse text-xs bg-amber-50/30">
                    <thead>
                      <tr className="bg-amber-100/60 border-b text-gray-700 font-semibold">
                        <th className="p-1.5 border">순위</th>
                        <th className="p-1.5 border">팀</th>
                        <th className="p-1.5 border">경기</th>
                        <th className="p-1.5 border">승무패</th>
                        <th className="p-1.5 border">득실</th>
                        <th className="p-1.5 border">🟨</th>
                        <th className="p-1.5 border">승점</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-amber-50/50">
                        <td className="p-1.5 border font-bold">1</td>
                        <td className="p-1.5 border font-bold">3반</td>
                        <td className="p-1.5 border">2</td>
                        <td className="p-1.5 border">2/0/0</td>
                        <td className="p-1.5 border font-bold text-amber-700">+10</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">6</span></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-1.5 border font-bold">2</td>
                        <td className="p-1.5 border font-bold">2반</td>
                        <td className="p-1.5 border">1</td>
                        <td className="p-1.5 border">1/0/0</td>
                        <td className="p-1.5 border font-bold text-amber-700">+6</td>
                        <td className="p-1.5 border">0</td>
                        <td className="p-1.5 border"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">3</span></td>
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