
import React, { useState, useMemo } from 'react';
import { MedicalExpense } from '../types';
import { Plus, Trash2, Calendar, Hospital, Stethoscope, Camera, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  items: MedicalExpense[];
  onAdd: (expense: Omit<MedicalExpense, 'id'>) => void;
  onRemove: (id: string) => void;
}

const MedicalExpenses: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearchDetailed, setIsSearchDetailed] = useState(false);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    clinicName: '',
    diagnosisName: '',
    date: ''
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clinicName: '',
    diagnosisName: '',
    price: 0,
    receiptImage: undefined as string | undefined
  });

  // 검색 로직
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesQuery = item.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.diagnosisName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClinic = !searchFilters.clinicName || item.clinicName.toLowerCase().includes(searchFilters.clinicName.toLowerCase());
      const matchesDiagnosis = !searchFilters.diagnosisName || item.diagnosisName.toLowerCase().includes(searchFilters.diagnosisName.toLowerCase());
      const matchesDate = !searchFilters.date || item.date === searchFilters.date;

      return matchesQuery && matchesClinic && matchesDiagnosis && matchesDate;
    });
  }, [items, searchQuery, searchFilters]);

  const totalMedicalCost = filteredItems.reduce((sum, item) => sum + item.price, 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsFormOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      clinicName: '',
      diagnosisName: '',
      price: 0,
      receiptImage: undefined
    });
  };

  const formatKRW = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">병원비 관리</h2>
          <p className="text-gray-500">건강검진, 수술, 예방접종 등 의료비 기록</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">결과 합계</p>
          <p className="text-2xl font-bold text-indigo-700">{formatKRW(totalMedicalCost)}</p>
        </div>
      </header>

      {/* Action & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="병원명 또는 진료항목 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
            <button 
              onClick={() => setIsSearchDetailed(!isSearchDetailed)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-indigo-50 rounded-xl transition-colors text-gray-400"
              title="세부 검색"
            >
              {isSearchDetailed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus size={20} />
            방문 기록 추가
          </button>
        </div>

        {/* 세부 검색 필터 */}
        {isSearchDetailed && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">병원명</label>
              <input 
                type="text" 
                placeholder="병원명 입력"
                value={searchFilters.clinicName}
                onChange={(e) => setSearchFilters({...searchFilters, clinicName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-indigo-300" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">진료항목</label>
              <input 
                type="text" 
                placeholder="진료/수술명 입력"
                value={searchFilters.diagnosisName}
                onChange={(e) => setSearchFilters({...searchFilters, diagnosisName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-indigo-300" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">방문 날짜</label>
              <input 
                type="date" 
                value={searchFilters.date}
                onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-indigo-300" 
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button 
                onClick={() => {
                  setSearchFilters({ clinicName: '', diagnosisName: '', date: '' });
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-500 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 border-t-4 border-t-indigo-600 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">새로운 병원비 기록</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">방문 날짜</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">병원 이름</label>
              <div className="relative">
                <Hospital size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 해피 동물병원" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">진료/수술명</label>
              <div className="relative">
                <Stethoscope size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="예: 종합 백신 접종" value={formData.diagnosisName} onChange={e => setFormData({...formData, diagnosisName: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-500">금액</label>
              <input type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-500">영수증 이미지</label>
                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase font-bold">선택 사항</span>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="receipt-upload"
                />
                <label 
                  htmlFor="receipt-upload"
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:bg-indigo-50 transition-all cursor-pointer group"
                >
                  {formData.receiptImage ? (
                    <div className="flex flex-col items-center">
                      <img src={formData.receiptImage} alt="Receipt Preview" className="h-32 rounded-lg mb-2 shadow-sm" />
                      <span className="text-xs text-indigo-500 font-semibold">이미지 변경하기</span>
                    </div>
                  ) : (
                    <>
                      <Camera size={32} className="text-gray-300 group-hover:text-indigo-400 mb-2" />
                      <span className="text-sm text-gray-400">사진 업로드 (생략 가능)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3 mt-4">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98]">진료 내역 저장</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">취소</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400">검색 결과가 없거나 기록된 병원비가 없습니다.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start justify-between group transition-all hover:shadow-md overflow-hidden">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 flex-shrink-0">
                  <Hospital size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{item.date} · {item.clinicName}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mt-0.5">{item.diagnosisName}</h4>
                  
                  {item.receiptImage && (
                    <div className="mt-3 relative group/img">
                      <img src={item.receiptImage} className="h-20 w-auto rounded-lg border border-gray-100" alt="receipt" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                         <button className="text-white text-[10px] font-bold">확대보기</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">{formatKRW(item.price)}</p>
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

export default MedicalExpenses;
