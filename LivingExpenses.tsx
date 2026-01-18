
import React, { useState, useMemo } from 'react';
import { LivingExpense, Category } from '../types';
import { Plus, Trash2, Calendar, Store, Tag, Package, Truck, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Props {
  items: LivingExpense[];
  onAdd: (expense: Omit<LivingExpense, 'id'>) => void;
  onRemove: (id: string) => void;
}

const LivingExpenses: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearchDetailed, setIsSearchDetailed] = useState(false);
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    itemName: '',
    vendor: '',
    category: '' as Category | '',
    date: ''
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    category: Category.FOOD,
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    shippingFee: 0
  });

  // 검색 로직
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 일반 검색 (상단 바)
      const matchesQuery = !searchQuery || 
                           item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 세부 필터 검색
      const matchesItemName = !searchFilters.itemName || item.itemName.toLowerCase().includes(searchFilters.itemName.toLowerCase());
      const matchesVendor = !searchFilters.vendor || item.vendor.toLowerCase().includes(searchFilters.vendor.toLowerCase());
      const matchesCategory = !searchFilters.category || item.category === searchFilters.category;
      const matchesDate = !searchFilters.date || item.date === searchFilters.date;

      return matchesQuery && matchesItemName && matchesVendor && matchesCategory && matchesDate;
    });
  }, [items, searchQuery, searchFilters]);

  const totalLivingCost = filteredItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = (formData.quantity * formData.unitPrice) + formData.shippingFee;
    onAdd({ ...formData, totalPrice });
    setIsFormOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      category: Category.FOOD,
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
          <h2 className="text-3xl font-bold text-gray-800">생활비 관리</h2>
          <p className="text-gray-500">사료, 간식, 장난감 등 일상 소모품 기록</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">결과 합계</p>
          <p className="text-2xl font-bold text-slate-700">{formatKRW(totalLivingCost)}</p>
        </div>
      </header>

      {/* Action & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="물품명 또는 판매처 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
            />
            <button 
              onClick={() => setIsSearchDetailed(!isSearchDetailed)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-50 rounded-xl transition-colors text-gray-400"
              title="세부 검색"
            >
              {isSearchDetailed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus size={20} />
            내역 추가
          </button>
        </div>

        {/* 세부 검색 필터 */}
        {isSearchDetailed && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">물품명</label>
              <input 
                type="text" 
                placeholder="물품명 입력"
                value={searchFilters.itemName}
                onChange={(e) => setSearchFilters({...searchFilters, itemName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-slate-300" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">판매처</label>
              <input 
                type="text" 
                placeholder="판매처 입력"
                value={searchFilters.vendor}
                onChange={(e) => setSearchFilters({...searchFilters, vendor: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-slate-300" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">카테고리</label>
              <select 
                value={searchFilters.category}
                onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value as Category | ''})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-slate-300 appearance-none"
              >
                <option value="">전체 보기</option>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">날짜</label>
              <input 
                type="date" 
                value={searchFilters.date}
                onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-slate-300" 
              />
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <button 
                onClick={() => {
                  setSearchFilters({ itemName: '', vendor: '', category: '', date: '' });
                  setSearchQuery('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal/Overlay */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 border-t-4 border-t-slate-800 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">새로운 생활비 기록</h3>
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
                <input type="text" placeholder="예: 쿠팡, 동네 마트" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">구분</label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all appearance-none">
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">물품명</label>
              <div className="relative">
                <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 연어 간식 500g" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-500">개수</label>
                <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-500">단가</label>
                <input type="number" min="0" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">배송비</label>
              <div className="relative">
                <Truck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" value={formData.shippingFee} onChange={e => setFormData({...formData, shippingFee: parseInt(e.target.value)})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button type="submit" className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">저장하기</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">취소</button>
            </div>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400">검색 결과가 없거나 기록된 생활비가 없습니다.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all hover:shadow-md">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  item.category === Category.FOOD ? 'bg-slate-100 text-slate-700' : item.category === Category.TOY ? 'bg-slate-50 text-slate-500' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Package size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">{item.category}</span>
                    <span className="text-xs text-gray-400">{item.date} · {item.vendor}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mt-0.5">{item.itemName}</h4>
                  <p className="text-xs text-gray-500">수량: {item.quantity}개 / 단가: {formatKRW(item.unitPrice)} {item.shippingFee > 0 && `/ 배송비: ${formatKRW(item.shippingFee)}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{formatKRW(item.totalPrice)}</p>
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

export default LivingExpenses;
