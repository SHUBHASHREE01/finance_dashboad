<div align="center">

<br/>

# **W E A L T H P U L S E**

### Personal Finance Dashboard — Built with React

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2-22C55E?style=for-the-badge)](https://recharts.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<br/>

> *Track every rupee. Visualize every trend. Control every transaction.*

<br/>

---

</div>

<br/>

## What is WealthPulse?

**WealthPulse** is a responsive, feature-rich personal finance dashboard that gives you a real-time overview of your money - income, expenses, balance trends, and spending patterns - all in one sleek interface. Built entirely on the frontend using React 19 + Recharts, with zero backend required.

<br/>

## Feature Breakdown

### Dashboard Overview

| Feature | Description |
|---------------------|--------------------------------------------------|
| **Balance Card** | Net balance computed live from all transactions |
| **Income Card** | Aggregated total of all income entries |
| **Expense Card** | Aggregated total of all expense entries |
| **Balance Trend Chart** | Area/line chart showing account balance over time |
| **Spending Breakdown** | Donut pie chart categorizing expenses visually |

<br/>

### Transaction Management

| Feature | Description |
|----------------------|------------------------------------------------|
| **Data Table** | Full transaction list — date, amount, category, type |
| **Live Search** | Instantly filters rows by category keyword |
| **Smart Sort** | Toggle between latest-first or highest-amount-first |
| **Add Transaction** | Admin-only form to log new income or expense records |
| **Delete Transaction** | Admin-only one-click row removal |

<br/>

### Role-Based Access Control

| Feature | Viewer | Admin |
|:--------|:------:|:-----:|
| View Dashboard | Yes | Yes |
| Browse Charts | Yes | Yes |
| Search & Sort | Yes | Yes |
| Add Transactions | No | Yes |
| Delete Records | No | Yes |
| Export Data | No | Yes |
| Sync Mock API | No | Yes |

<br/>

### Automated Insights

- **Highest Spending Category** — auto-detects where most money is going
- **Monthly Comparison** — income vs. expense aggregated by month
- **Smart Observation** — dynamic feedback based on your financial behavior

<br/>

### Optional Enhancements

- **Data Persistence** — `localStorage` saves and restores all transactions across sessions
- **CSV Export** — one-click download of all transaction records as `.csv`
- **Dark / Light Mode** — theme toggle with smooth CSS transitions
- **Animations** — staggered card entrance, animated number counters, floating particles, toast notifications
- **Responsive Layout** — Flexbox-first design that wraps cleanly on any screen size

<br/>

---

## Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| React 19 | UI & State |
| Vite 5 | Build & Dev Server |
| Recharts 2 | Data Visualization |
| Vanilla CSS3 | Styling & Animations |
| localStorage | Client Persistence |

<br/>

---

## Project Structure

```
finance-dashboard/
│
├── src/
│   ├── App.jsx          ← Core app: all components, state & logic
│   ├── App.css          ← Design system: tokens, layout, animations
│   ├── index.css        ← Global reset & base styles
│   └── main.jsx         ← React entry point
│
├── public/
├── package.json
└── vite.config.js
```

**Component breakdown inside `App.jsx`:**

```
App
 ├── <Sidebar />            — Navigation panel
 ├── <TopBar />             — Search, sort, role toggle, export
 ├── <TransactionForm />    — Add record form (Admin only)
 ├── KPI Cards              — Balance, Income, Expense, Insight
 ├── <BalanceTrendChart />  — AreaChart (balance over time)
 ├── <SpendingPieChart />   — Donut PieChart (categories)
 └── <TransactionsTable />  — Sortable, searchable data grid
```

<br/>

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SHUBHASHREE01/finance_dashboad.git
cd finance_dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

<br/>

### Available Scripts

| Command | Description |
|-------------------|--------------------------------|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

<br/>

---

## Technical Approach

### State Management
All application state lives in `useState` hooks at the top-level `App` component. The `transactions` array is the single source of truth — every derived metric (balance, chart data, pie slices, insights) is computed from it on each render.

### Side Effects
`useEffect` is used strictly for:
1. Hydrating state from `localStorage` on first mount
2. Writing state back to `localStorage` on every change
3. Toggling the `dark` class on `document.body`

### Styling Strategy
A CSS custom-property design system (`--variables`) defines all colors, spacing, radii, and shadows. Components reference tokens rather than hardcoded values, making theme switching (dark ↔ light) a single class toggle on the root element.

<br/>

---

## UI Highlights

```
◈ Glassmorphic sidebar with backdrop-filter blur
◈ Animated KPI cards with staggered entrance
◈ Gradient-filled area chart with custom tooltip
◈ Donut pie chart with inline category legend
◈ Slide-in transaction form (CSS height animation)
◈ Toast notification system (add / delete / sync / export)
◈ Floating ambient particle layer
◈ DM Mono + Syne font pairing
```

<br/>

---

<div align="center">

**Built with 💜 by [Shubhashree TK](https://github.com/SHUBHASHREE01)**

*React · Recharts · Vite · Vanilla CSS*

</div>