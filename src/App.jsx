import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ReceiptText, Shield, ShieldAlert, Moon, Sun } from 'lucide-react';
import { useLocalData } from './hooks/useLocalData';
import { dummyTxs } from './utils/mockData';
import { DashView } from './components/DashView';
import { TxList } from './components/TxList';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [userRole, setUserRole] = useLocalData('my_role', 'admin');
  const [isDark, setIsDark] = useLocalData('my_theme_dark', false);
  const [data, setData] = useLocalData('my_txs', dummyTxs);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    // fake api load
    setLoading(true);
    let t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const fakeRequest = (cb) => {
    setBusy(true);
    setTimeout(() => {
      cb();
      setBusy(false);
    }, 500);
  };

  const addTx = (t) => fakeRequest(() => setData(p => [...p, t]));
  const editTx = (t) => fakeRequest(() => setData(p => p.map(x => x.id === t.id ? t : x)));
  const delTx = (id) => {
    if(window.confirm('Delete this one?')) {
      fakeRequest(() => setData(p => p.filter(x => x.id !== id)));
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row ${isDark ? 'dark' : ''}`}>
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-bold">FinDash</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dash
          </button>
          <button onClick={() => setView('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${view === 'transactions' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ReceiptText className="w-5 h-5" /> Logs
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Theme</span>
              <button onClick={() => setIsDark(!isDark)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Role</span>
              <button onClick={() => setUserRole(userRole === 'admin' ? 'viewer' : 'admin')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm bg-slate-200 text-slate-700">
                {userRole === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {userRole.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold capitalize">{view}</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Saved locally
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {view === 'dashboard' && <DashView txData={data} loading={loading} />}
          {view === 'transactions' && <TxList txData={data} userRole={userRole} handleAdd={addTx} handleEdit={editTx} handleDel={delTx} loading={loading} busy={busy} />}
        </div>
      </main>
    </div>
  );
}