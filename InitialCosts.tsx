
import React, { useState } from 'react';
import { InitialCost } from '../types';
import { Plus, Trash2, Store, Package, ShoppingBag, Truck, Calendar, Calculator } from 'lucide-react';

interface Props {
  items: InitialCost[];
  onAdd: (cost: Omit<InitialCost, 'id'>) => void;
  onRemove: (id: string) => void;
}

const InitialCosts: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    shippingFee: 0
  });

  const totalInitialCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = (formData.quantity * formData.unitPrice) + formData.shippingFee;
    onAdd({ ...formData, totalPrice });
    setIsFormOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      shippingFee: 0
    });
  };

  const formatKRW = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">초기 비용 관리</h2>
          <p className="text-gray-500">고양이를 데려오기 전 기본적으로 셋팅되어야 하는 물품들의 지출을 관리합니다.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">초기 준비 총 지출</p>
          <p className="text-3xl font-bold text-slate-800">{formatKRW(totalInitialCost)}</p>
        </div>
      </header>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={20} />
          준비물 추가
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 border-t-4 border-t-slate-700 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">필수 준비물 기록</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">날짜</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">판매처</label>
              <div className="relative">
                <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 네이버 쇼핑, 집앞 마트" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">물품명</label>
              <div className="relative">
                <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 원목 캣타워 5단" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-500">개수</label>
                <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-500">단가</label>
                <input type="number" min="0" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">배송비</label>
              <div className="relative">
                <Truck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" value={formData.shippingFee} onChange={e => setFormData({...formData, shippingFee: parseInt(e.target.value) || 0})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
              </div>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
               <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><Calculator size={16} /> 예상 합계 금액</span>
               <span className="text-lg font-black text-slate-800">{formatKRW((formData.quantity * formData.unitPrice) + formData.shippingFee)}</span>
            </div>

            <div className="md:col-span-2 flex gap-3 mt-4">
              <button type="submit" className="flex-1 bg-slate-700 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md">목록에 추가</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">취소</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">아직 등록된 초기 비용이 없습니다.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col group transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 flex-shrink-0">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 uppercase">Initial Set</span>
                       <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mt-1 text-lg">{item.itemName}</h4>
                    <p className="text-sm text-gray-500 font-medium">{item.vendor}</p>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-50 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>단가 x 개수</span>
                  <span className="font-medium">{formatKRW(item.unitPrice)} x {item.quantity}개</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>물품 가격</span>
                  <span className="font-semibold text-gray-700">{formatKRW(item.unitPrice * item.quantity)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>배송비</span>
                  <span className="font-medium">{item.shippingFee > 0 ? formatKRW(item.shippingFee) : '무료배송'}</span>
                </div>
                <div className="pt-3 flex justify-between items-end border-t border-dashed border-gray-100">
                  <span className="text-sm font-bold text-slate-500">지출 총 금액</span>
                  <span className="text-xl font-black text-slate-800">{formatKRW(item.totalPrice)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InitialCosts;
