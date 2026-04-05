import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Lightbulb, Loader2 } from 'lucide-react';
import { formatCash } from '../utils/mockData';

export const DashView = ({ txData, loading }) => {
  const { inc, exp, bal } = useMemo(() => {
    return txData.reduce((acc, curr) => {
      if (curr.type === 'income') acc.inc += curr.amount;
      else acc.exp += curr.amount;
      acc.bal = acc.inc - acc.exp;
      return acc;
    }, { inc: 0, exp: 0, bal: 0 });
  }, [txData]);

  const spendByCategory = useMemo(() => {
    const expenses = txData.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    let res = Object.keys(grouped).map(name => ({ name, value: grouped[name] }));
    res.sort((a, b) => b.value - a.value);
    return res;
  }, [txData]);

  const linePoints = useMemo(() => {
    if (!txData.length) return '';
    let sorted = [...txData].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runBal = 0;
    
    let pts = sorted.map((t, i) => {
      runBal += t.type === 'income' ? t.amount : -t.amount;
      return { x: i, y: runBal };
    });

    let maxX = pts.length - 1 || 1;
    let minY = Math.min(0, ...pts.map(p => p.y));
    let maxY = Math.max(...pts.map(p => p.y));
    let rangeY = maxY - minY || 1;

    return pts.map(p => {
      let xPos = (p.x / maxX) * 100;
      let yPos = 100 - ((p.y - minY) / rangeY) * 100;
      return `${xPos},${yPos}`;
    }).join(' ');
  }, [txData]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Crunching numbers...</p>
      </div>
    );
  }

  const topCategory = spendByCategory[0]?.name || 'N/A';
  const maxSpend = Math.max(0, ...txData.filter(t => t.type === 'expense').map(t => t.amount));
  const saveRate = inc > 0 ? ((inc - exp) / inc * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCash(bal)}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Income</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCash(inc)}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Expenses</h3>
            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCash(exp)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Balance Trend</h3>
          <div className="relative h-48 w-full">
            {txData.length > 1 ? (
              <svg viewBox="0 -10 100 120" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="1" strokeDasharray="2" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="1" />
                <polyline 
                  points={linePoints} fill="none" stroke="currentColor" 
                  className="text-indigo-500 dark:text-indigo-400" strokeWidth="3" 
                  strokeLinecap="round" strokeLinejoin="round" 
                />
              </svg>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Need more data</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Where is it going?</h3>
          <div className="space-y-4">
            {spendByCategory.length > 0 ? spendByCategory.slice(0, 5).map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{c.name}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCash(c.value)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(c.value / exp) * 100}%` }}></div>
                </div>
              </div>
            )) : (
              <div className="py-8 flex items-center justify-center text-slate-400 text-sm">No expenses yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">Quick Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Highest Category</p>
            <p className="font-semibold text-slate-900 dark:text-white">{topCategory}</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Savings Rate</p>
            <p className="font-semibold text-slate-900 dark:text-white">{saveRate}%</p>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Biggest Purchase</p>
            <p className="font-semibold text-slate-900 dark:text-white">{formatCash(maxSpend)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};