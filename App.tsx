
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Stethoscope, 
  PackagePlus, 
  TrendingUp,
  BarChart3,
  Wallet
} from 'lucide-react';
import { ActiveTab, AppState, LivingExpense, MedicalExpense, InitialCost, Income } from './types';
import Summary from './components/Summary';
import LivingExpenses from './components/LivingExpenses';
import MedicalExpenses from './components/MedicalExpenses';
import InitialCosts from './components/InitialCosts';
import MonthlySummary from './components/MonthlySummary';
import IncomeRecords from './components/IncomeRecords';

const STORAGE_KEY = 'pet_ledger_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      livingExpenses: [],
      medicalExpenses: [],
      initialCosts: [],
      incomes: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addLivingExpense = (expense: Omit<LivingExpense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, livingExpenses: [newExpense, ...prev.livingExpenses] }));
  };

  const removeLivingExpense = (id: string) => {
    setState(prev => ({ ...prev, livingExpenses: prev.livingExpenses.filter(e => e.id !== id) }));
  };

  const addMedicalExpense = (expense: Omit<MedicalExpense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, medicalExpenses: [newExpense, ...prev.medicalExpenses] }));
  };

  const removeMedicalExpense = (id: string) => {
    setState(prev => ({ ...prev, medicalExpenses: prev.medicalExpenses.filter(e => e.id !== id) }));
  };

  const addInitialCost = (cost: Omit<InitialCost, 'id'>) => {
    const newCost = { ...cost, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, initialCosts: [newCost, ...prev.initialCosts] }));
  };

  const removeInitialCost = (id: string) => {
    setState(prev => ({ ...prev, initialCosts: prev.initialCosts.filter(e => e.id !== id) }));
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = { ...income, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, incomes: [newIncome, ...prev.incomes] }));
  };

  const removeIncome = (id: string) => {
    setState(prev => ({ ...prev, incomes: prev.incomes.filter(i => i.id !== id) }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary state={state} onNavigate={setActiveTab} />;
      case 'monthly':
        return <MonthlySummary state={state} />;
      case 'living':
        return <LivingExpenses items={state.livingExpenses} onAdd={addLivingExpense} onRemove={removeLivingExpense} />;
      case 'medical':
        return <MedicalExpenses items={state.medicalExpenses} onAdd={addMedicalExpense} onRemove={removeMedicalExpense} />;
      case 'income':
        return <IncomeRecords items={state.incomes} onAdd={addIncome} onRemove={removeIncome} />;
      case 'initial':
        return <InitialCosts items={state.initialCosts} onAdd={addInitialCost} onRemove={removeInitialCost} />;
      default:
        return <Summary state={state} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64 bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-3xl">🐾</span> 냥가계부
          </h1>
          <p className="text-sm text-gray-400 mt-1">Mackerel Tabby Edition</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavBtn active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<LayoutDashboard size={20} />} label="총 지출" />
          <NavBtn active={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} icon={<BarChart3 size={20} />} label="통계" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">기록 관리</div>
          <NavBtn active={activeTab === 'living'} onClick={() => setActiveTab('living')} icon={<ShoppingCart size={20} />} label="생활비" />
          <NavBtn active={activeTab === 'medical'} onClick={() => setActiveTab('medical')} icon={<Stethoscope size={20} />} label="병원비" />
          <NavBtn active={activeTab === 'income'} onClick={() => setActiveTab('income')} icon={<Wallet size={20} />} label="소득/지원" />
          <NavBtn active={activeTab === 'initial'} onClick={() => setActiveTab('initial')} icon={<PackagePlus size={20} />} label="초기 비용" />
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-bold text-slate-800">🐾 냥가계부</h1>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <TrendingUp size={14} />
          <span>고등어 태비 매니저</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 lg:p-8">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-3 px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] overflow-x-auto">
        <MobNavBtn active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<LayoutDashboard size={24} />} label="총지출" />
        <MobNavBtn active={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} icon={<BarChart3 size={24} />} label="통계" />
        <MobNavBtn active={activeTab === 'living'} onClick={() => setActiveTab('living')} icon={<ShoppingCart size={24} />} label="생활비" />
        <MobNavBtn active={activeTab === 'medical'} onClick={() => setActiveTab('medical')} icon={<Stethoscope size={24} />} label="병원비" />
        <MobNavBtn active={activeTab === 'initial'} onClick={() => setActiveTab('initial')} icon={<PackagePlus size={24} />} label="초기비용" />
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobNavBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 min-w-[64px] transition-all flex-shrink-0 ${
      active ? 'text-slate-800' : 'text-gray-400'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
