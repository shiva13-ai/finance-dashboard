export const dummyTxs = [
  { id: 'tx_1', date: '2026-04-01', amount: 4500, category: 'Salary', type: 'income', desc: 'Acme Corp Paycheck' },
  { id: 'tx_2', date: '2026-04-02', amount: 1250, category: 'Housing', type: 'expense', desc: 'rent april' },
  { id: 'tx_3', date: '2026-04-03', amount: 142.50, category: 'Utilities', type: 'expense', desc: 'pg&e bill' },
  { id: 'tx_4', date: '2026-04-05', amount: 45, category: 'Transport', type: 'expense', desc: 'uber' },
  { id: 'tx_5', date: '2026-04-08', amount: 120.99, category: 'Food', type: 'expense', desc: 'whole foods' },
  { id: 'tx_6', date: '2026-04-10', amount: 1500, category: 'Investment', type: 'income', desc: 'sold some stock' },
  { id: 'tx_7', date: '2026-04-12', amount: 75, category: 'Entertainment', type: 'expense', desc: 'movie + snacks' },
  { id: 'tx_8', date: '2026-04-15', amount: 80, category: 'Food', type: 'expense', desc: 'doordash' },
  { id: 'tx_9', date: '2026-04-18', amount: 65, category: 'Utilities', type: 'expense', desc: 'wifi' },
];

export const cats = {
  income: ['Salary', 'Investment', 'Gift', 'Other'],
  expense: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Other']
};

export const formatCash = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
export const formatDate = (dateStr) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));