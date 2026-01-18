
import React from 'react';
import { AppState, Category, ActiveTab } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChevronRight, CreditCard, HeartPulse, Sparkles, ShoppingCart } from 'lucide-react';

interface SummaryProps {
  state: AppState;
  onNavigate: (tab: ActiveTab) => void;
}

const Summary: React.FC<SummaryProps> = ({ state, onNavigate }) => {
  const livingTotal = state.livingExpenses.reduce((sum, item) => sum + item.totalPrice, 0);
  const medicalTotal = state.medicalExpenses.reduce((sum, item) => sum + item.price, 0);
  const initialTotal = state.initialCosts.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = livingTotal + medicalTotal;

  const livingBreakdown = {
    [Category.FOOD]: state.livingExpenses.filter(e => e.category === Category.FOOD).reduce((sum, e) => sum + e.totalPrice, 0),
    [Category.TOY]: state.livingExpenses.filter(e => e.category === Category.TOY).reduce((sum, e) => sum + e.totalPrice, 0),
    [Category.SUPPLY]: state.livingExpenses.filter(e => e.category === Category.SUPPLY).reduce((sum, e) => sum + e.totalPrice, 0),
  };

  const chartData = [
    { name: Category.FOOD, value: livingBreakdown[Category.FOOD], color: '#475569' }, // slate-600
    { name: Category.TOY, value: livingBreakdown[Category.TOY], color: '#94a3b8' }, // slate-400
    { name: Category.SUPPLY, value: livingBreakdown[Category.SUPPLY], color: '#cbd5e1' }, // slate-300
  ].filter(d => d.value > 0);

  const formatKRW = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">지출 대시보드</h2>
        <p className="text-gray-500">우리 집 고등어냥이를 위한 소비 요약</p>
      </header>

      {/* Main Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <CreditCard size={60} />
          </div>
          <p className="text-slate-300 text-sm font-medium">총 지출 (생활비+병원비)</p>
          <h3 className="text-2xl lg:text-3xl font-bold mt-2">{formatKRW(grandTotal)}</h3>
          <div className="mt-4 flex gap-2">
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-xs border border-white/10">기록 {state.livingExpenses.length + state.medicalExpenses.length}건</div>
          </div>
        </div>

        {/* Living Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2 text-slate-600 font-semibold mb-1">
              <ShoppingCart size={18} />
              <span>생활비 요약</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{formatKRW(livingTotal)}</h3>
          </div>
          <button 
            onClick={() => onNavigate('living')}
            className="mt-4 flex items-center justify-between w-full text-xs text-gray-400 hover:text-slate-800 transition-colors"
          >
            생활비 내역 확인하기 <ChevronRight size={14} />
          </button>
        </div>

        {/* Medical Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
              <HeartPulse size={18} />
              <span>병원비 요약</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{formatKRW(medicalTotal)}</h3>
          </div>
          <button 
            onClick={() => onNavigate('medical')}
            className="mt-4 flex items-center justify-between w-full text-xs text-gray-400 hover:text-slate-800 transition-colors"
          >
            병원비 내역 확인하기 <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Living Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={20} className="text-slate-400" />
              생활비 세부 분석
            </h4>
            <span className="text-slate-700 font-bold">{formatKRW(livingTotal)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatKRW(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                  기록된 생활비가 없습니다.
                </div>
              )}
            </div>

            <div className="space-y-4">
              {Object.entries(livingBreakdown).map(([cat, amount]) => (
                <div key={cat} className="flex flex-col">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>{cat}</span>
                    <span>{formatKRW(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        cat === Category.FOOD ? 'bg-slate-700' : cat === Category.TOY ? 'bg-slate-500' : 'bg-slate-300'
                      }`} 
                      style={{ width: `${livingTotal > 0 ? (amount / livingTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Initial Cost summary */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <h4 className="text-xl font-bold text-gray-800 mb-4">초기 비용</h4>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
              <Sparkles size={32} />
            </div>
            <p className="text-gray-400 text-sm mb-1">입양 전 기본 세팅 비용</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatKRW(initialTotal)}</h3>
          </div>
          <button 
            onClick={() => onNavigate('initial')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-100 text-gray-600 font-medium hover:bg-gray-50 transition-all"
          >
            상세 내역 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
