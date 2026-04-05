import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, FileSpreadsheet, FileJson, Loader2, Edit2, Trash2, AlertCircle, Plus } from 'lucide-react';
import { formatCash, formatDate } from '../utils/mockData';
import { TxForm } from './TxForm';

export const TxList = ({ txData, userRole, handleAdd, handleEdit, handleDel, loading, busy }) => {
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [sortParam, setSortParam] = useState('date-desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDls, setShowDls] = useState(false);

  const displayedTxs = useMemo(() => {
    let arr = txData.filter(t => {
      let mSearch = t.desc.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase());
      let mType = typeFilter === 'all' || t.type === typeFilter;
      let mCat = catFilter === 'all' || t.category === catFilter;
      return mSearch && mType && mCat;
    });

    return arr.sort((a, b) => {
      if (sortParam === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortParam === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortParam === 'amount-desc') return b.amount - a.amount;
      if (sortParam === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [txData, q, typeFilter, catFilter, sortParam]);

  const openForm = (item = null) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const saveItem = (t) => {
    if (editingItem) handleEdit(t);
    else handleAdd(t);
    setModalOpen(false);
  };

  const dlCsv = () => {
    let headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    let rows = displayedTxs.map(t => [t.date, t.desc, t.category, t.type, t.amount]);
    let csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    let link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "export.csv";
    link.click();
    setShowDls(false);
  };

  const dlJson = () => {
    let blob = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayedTxs, null, 2));
    let link = document.createElement("a");
    link.href = blob;
    link.download = "data.json";
    link.click();
    setShowDls(false);
  };

  const allCats = useMemo(() => Array.from(new Set(txData.map(t => t.category))).sort(), [txData]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex flex-wrap flex-1 gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
            <option value="all">All Categories</option>
            {allCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortParam} onChange={e => setSortParam(e.target.value)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest Amt</option>
            <option value="amount-asc">Lowest Amt</option>
          </select>
        </div>
        
        <div className="flex gap-2 relative">
          <button onClick={() => setShowDls(!showDls)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDls && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 py-1">
              <button onClick={dlCsv} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"><FileSpreadsheet className="w-4 h-4"/> CSV</button>
              <button onClick={dlJson} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"><FileJson className="w-4 h-4"/> JSON</button>
            </div>
          )}

          {userRole === 'admin' && (
            <button onClick={() => openForm()} disabled={busy} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span className="hidden sm:inline">New Tx</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative">
        {busy && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="p-4 text-sm font-medium text-slate-500">Date</th>
                <th className="p-4 text-sm font-medium text-slate-500">Description</th>
                <th className="p-4 text-sm font-medium text-slate-500">Category</th>
                <th className="p-4 text-sm font-medium text-slate-500">Amount</th>
                {userRole === 'admin' && <th className="p-4 text-sm font-medium text-slate-500 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={userRole === 'admin' ? 5 : 4} className="p-12 text-center">
                     <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
                     <p className="text-slate-500 text-sm">Fetching...</p>
                  </td>
                </tr>
              ) : displayedTxs.length > 0 ? (
                displayedTxs.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(t.date)}</td>
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{t.desc}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{t.category}</span>
                    </td>
                    <td className={`p-4 text-sm font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCash(t.amount)}
                    </td>
                    {userRole === 'admin' && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(t)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDel(t.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={userRole === 'admin' ? 5 : 4} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 mb-2 text-slate-300" />
                      <p>Nothing here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <TxForm initial={editingItem} close={() => setModalOpen(false)} save={saveItem} />}
    </div>
  );
};