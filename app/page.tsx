'use client';

import { useEffect, useState } from 'react';

interface MatchData {
  rowIdx: number;
  group: string;
  date: string;
  match1: string;
  match2: string;
  location: string;
  note: string;
}

export default function Home() {
  const [schedule, setSchedule] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 백엔드 API에서 대진표 데이터 불러오기
    fetch('/api/schedule?grade=3&group=ALL')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSchedule(resData.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('데이터 로드 실패:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🏆 DH League 대진표</h1>

        {loading ? (
          <p className="text-center text-lg">대진표를 불러오는 중입니다...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border">조</th>
                  <th className="p-3 border">날짜</th>
                  <th className="p-3 border">경기 1</th>
                  <th className="p-3 border">경기 2</th>
                  <th className="p-3 border">장소</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item) => (
                  <tr key={item.rowIdx} className="hover:bg-gray-100 border-b">
                    <td className="p-3 border font-semibold text-center">{item.group}</td>
                    <td className="p-3 border">{item.date}</td>
                    <td className="p-3 border">{item.match1}</td>
                    <td className="p-3 border">{item.match2}</td>
                    <td className="p-3 border">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}