
import React, { useState } from 'react';
import { Income } from '../types';
import { Plus, Trash2, Calendar, Wallet, HeartHandshake } from 'lucide-react';

interface Props {
  items: Income[];
  onAdd: (income: Omit<Income, 'id'>) => void;
  onRemove: (id: string) => void;
}

const IncomeRecords: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: '',
    amount: 0
  });

  const totalIncome = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsFormOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      source: '',
      amount: 0
    });
  };

  const formatKRW = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">소득 및 지원 기록</h2>
          <p className="text-gray-500">용돈, 집사 보너스, 후원금 등을 기록하세요</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">누적 총 소득</p>
          <p className="text-2xl font-bold text-slate-600">{formatKRW(totalIncome)}</p>
        </div>
      </header>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-slate-100 hover:bg-slate-900 transition-all active:scale-95"
        >
          <Plus size={20} />
          소득 기록 추가
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 border-t-4 border-t-slate-800 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">새로운 소득 기록</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">날짜</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">항목명 (출처)</label>
              <div className="relative">
                <Wallet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 냥이 용돈, 보너스" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">금액</label>
              <input type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500" required />
            </div>

            <div className="md:col-span-2 flex gap-3 mt-4">
              <button type="submit" className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">저장하기</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">취소</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400">아직 기록된 소득이 없습니다.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all hover:shadow-md">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mt-0.5">{item.source}</h4>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">+{formatKRW(item.amount)}</p>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeRecords;
