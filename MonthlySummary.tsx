
import React, { useMemo, useState } from 'react';
import { AppState } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

interface MonthlySummaryProps {
  state: AppState;
}

type ViewFilter = 'total' | 'living' | 'medical';

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ state }) => {
  const currentYear = new Date().getFullYear();
  // 현재 연도가 2026~2050 사이가 아니면 2026을 기본값으로
  const defaultYear = (currentYear >= 2026 && currentYear <= 2050) ? currentYear : 2026;
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [filter, setFilter] = useState<ViewFilter>('total');

  // 2026년부터 2050년까지의 연도 목록 생성 (오름차순: 2026이 맨 위)
  const availableYears = useMemo(() => {
    const years = [];
    for (let y = 2026; y <= 2050; y++) {
      years.push(y);
    }
    return years;
  }, []);

  // 선택된 연도의 1월~12월 데이터 가공
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: `${i + 1}월`,
      monthNum: i + 1,
      living: 0,
      medical: 0,
      total: 0
    }));

    // 생활비 합산
    state.livingExpenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === selectedYear) {
        months[d.getMonth()].living += e.totalPrice;
      }
    });

    // 병원비 합산
    state.medicalExpenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === selectedYear) {
        months[d.getMonth()].medical += e.price;
      }
    });

    // 전체 합산 및 필터링
    return months.map(m => ({
      ...m,
      total: m.living + m.medical
    }));
  }, [state, selectedYear]);

  const formatKRW = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  const getActiveBar = () => {
    switch (filter) {
      case 'living': return <Bar name="생활비" dataKey="living" fill="#64748b" radius={[4, 4, 0, 0]} barSize={24} />;
      case 'medical': return <Bar name="병원비" dataKey="medical" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />;
      default: return (
        <>
          <Bar name="생활비" dataKey="living" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} barSize={24} />
          <Bar name="병원비" dataKey="medical" stackId="a" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
        </>
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">지출 통계 분석</h2>
          <p className="text-gray-500">카테고리별 1년 지출 추이를 확인하세요</p>
        </div>
        
        {/* 연도 선택 드롭다운 */}
        <div className="relative inline-block">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold cursor-pointer shadow-sm"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Calendar size={18} />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </header>

      {/* 그래프 영역 */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Filter size={20} className="text-slate-400" />
            {selectedYear}년 월별 지출 현황
          </div>
          
          {/* 필터 버튼 */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            <FilterBtn active={filter === 'total'} onClick={() => setFilter('total')} label="전체" />
            <FilterBtn active={filter === 'living'} onClick={() => setFilter('living')} label="생활비" />
            <FilterBtn active={filter === 'medical'} onClick={() => setFilter('medical')} label="병원비" />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#cbd5e1' }}
                tickFormatter={(val) => val >= 10000 ? `${val / 10000}만` : val}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => formatKRW(val)}
              />
              <Legend 
                iconType="circle" 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }} 
              />
              {getActiveBar()}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard 
          label="연간 총 지출" 
          value={chartData.reduce((acc, cur) => acc + cur.total, 0)} 
          colorClass="text-slate-800"
          formatKRW={formatKRW}
        />
        <SummaryCard 
          label="연간 생활비" 
          value={chartData.reduce((acc, cur) => acc + cur.living, 0)} 
          colorClass="text-slate-500"
          formatKRW={formatKRW}
        />
        <SummaryCard 
          label="연간 병원비" 
          value={chartData.reduce((acc, cur) => acc + cur.medical, 0)} 
          colorClass="text-indigo-600"
          formatKRW={formatKRW}
        />
      </div>
    </div>
  );
};

const FilterBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
      active ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {label}
  </button>
);

const SummaryCard: React.FC<{ label: string; value: number; colorClass: string; formatKRW: (v: number) => string }> = ({ label, value, colorClass, formatKRW }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
    <p className={`text-xl font-bold ${colorClass}`}>{formatKRW(value)}</p>
  </div>
);

export default MonthlySummary;
