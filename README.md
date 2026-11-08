# Finance Dashboard

A small personal finance dashboard built with React and Tailwind CSS. It shows a summary of income and expenses and lets you manage a list of transactions. All data stays in the browser (localStorage); there is no backend.

## Features

- Dashboard with total balance, income and expenses
- Balance trend line (SVG) and a top-5 spending by category list
- Quick insights: highest spending category, savings rate, biggest purchase
- Transactions page with search, type and category filters, and sorting by date or amount
- Add, edit and delete transactions (delete asks for confirmation)
- Admin / viewer role toggle; viewers cannot add, edit or delete
- Export the currently filtered transactions as CSV or JSON
- Light and dark theme
- Data, role and theme are saved in localStorage; the app starts with a few sample transactions
- Loading states are simulated with short timeouts (the "API" is fake)

## Tech Stack

- React 18
- Vite
- Tailwind CSS (with PostCSS and Autoprefixer)
- lucide-react for icons

## Project Structure

```
index.html
src/
  main.jsx              entry point
  App.jsx               layout, navigation, theme, role, transaction state
  components/
    DashView.jsx        dashboard cards, trend chart, insights
    TxList.jsx          transactions table, filters, export
    TxForm.jsx          add/edit modal form
  hooks/useLocalData.js localStorage-backed state hook
  utils/mockData.js     sample data, categories, formatters
```

## Getting Started

You need Node.js and npm.

```bash
git clone https://github.com/shiva13-ai/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the build locally
```

## Usage

- Use "Dash" in the sidebar for the summary and "Logs" for the transaction list.
- On "Logs", use "New Tx" to add a record, or the edit and trash icons on a row.
- Switch the role in the sidebar to see the read-only viewer mode.
- To reset to the sample data, clear the site's localStorage keys `my_txs`, `my_role` and `my_theme_dark`.

## Notes

- Amounts are formatted as USD.
- No environment variables are needed.
