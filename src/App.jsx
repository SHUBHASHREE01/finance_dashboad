import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import "./App.css";

const COLORS = ["#00f5c4", "#7c6fcd", "#ff6b6b", "#ffd93d", "#6bcb77"];

function AnimatedNumber({ value, prefix = "₹" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 900;
    const step = Math.abs(end - start) / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      setDisplay(Math.round(current));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const initialData = [
    { id: 1, date: "Apr 1, 2026", amount: 5000, category: "Salary", type: "income" },
    { id: 2, date: "Apr 2, 2026", amount: 200, category: "Food", type: "expense" },
    { id: 3, date: "Apr 3, 2026", amount: 1000, category: "Shopping", type: "expense" },
  ];

  const [transactions, setTransactions] = useState(initialData);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("viewer");
  const [sort, setSort] = useState("latest");
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [formVisible, setFormVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("txns_v2"));
    if (stored) setTransactions(stored);
    const mode = localStorage.getItem("dm_v2");
    if (mode !== null) setDarkMode(JSON.parse(mode));
  }, []);

  useEffect(() => {
    localStorage.setItem("txns_v2", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("dm_v2", JSON.stringify(darkMode));
    document.body.classList.toggle("light-theme", !darkMode);
  }, [darkMode]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const fetchMockTransactions = () => {
    const mockData = [
      { id: 101, date: "Apr 4, 2026", amount: 1200, category: "Freelance", type: "income" },
      { id: 102, date: "Apr 5, 2026", amount: 300, category: "Transport", type: "expense" },
      { id: 103, date: "Apr 6, 2026", amount: 850, category: "Food", type: "expense" },
      { id: 104, date: "Apr 7, 2026", amount: 2500, category: "Rent", type: "expense" },
      { id: 105, date: "Apr 8, 2026", amount: 500, category: "Utilities", type: "expense" },
      { id: 106, date: "Apr 9, 2026", amount: 3000, category: "Salary", type: "income" },
      { id: 107, date: "Apr 10, 2026", amount: 450, category: "Shopping", type: "expense" },
      { id: 108, date: "Apr 11, 2026", amount: 150, category: "Entertainment", type: "expense" },
      { id: 109, date: "Apr 12, 2026", amount: 800, category: "Freelance", type: "income" },
      { id: 110, date: "Apr 13, 2026", amount: 120, category: "Transport", type: "expense" },
    ];
    setTimeout(() => {
      setTransactions(prev => [...prev, ...mockData]);
      showToast("10 transactions synced!");
    }, 900);
    showToast("Fetching from API...", "info");
  };

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const lineData = transactions.reduce((acc, t) => {
    const last = acc.length ? acc[acc.length - 1].balance : 0;
    const newBal = t.type === "income" ? last + t.amount : last - t.amount;
    acc.push({ date: t.date.slice(0, 6), balance: newBal });
    return acc;
  }, []);

  const pieData = Object.values(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
      acc[t.category].value += t.amount;
      return acc;
    }, {})
  );

  const filteredData = transactions
    .filter(t => t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "amount" ? b.amount - a.amount : new Date(b.date) - new Date(a.date));

  const highestSpendingCategory = () => {
    const expArr = transactions.filter(t => t.type === "expense");
    if (!expArr.length) return { name: "No data", amount: 0 };
    const totals = expArr.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const maxCat = Object.keys(totals).reduce((a, b) => totals[a] > totals[b] ? a : b);
    return { name: maxCat, amount: totals[maxCat] };
  };

  const monthlyComparison = () => {
    const monthly = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("en-US", { month: "short", year: "numeric" });
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      acc[month][t.type] += t.amount;
      return acc;
    }, {});
    return Object.entries(monthly).map(([month, data]) => ({ month, ...data }));
  };

  const observations = () => {
    if (!transactions.length) return { text: "No transactions yet", icon: "○" };
    if (expense > income) return { text: "Spending exceeds income this period", icon: "!" };
    if (savingsRate >= 50) return { text: "Exceptional savings rate!", icon: "*" };
    if (income > expense) return { text: "On track — you're saving money", icon: "✓" };
    return { text: "Income and expenses balanced", icon: "=" };
  };

  const navItems = [
    { label: "Dashboard", icon: "◈" },
    { label: "Transactions", icon: "⇌" },
    { label: "Insights", icon: "◉" },
  ];

  const exportCSV = () => {
    if (!transactions.length) return showToast("No transactions to export", "error");
    const headers = ["Date", "Amount", "Category", "Type"];
    const rows = transactions.map(t => [t.date, t.amount, t.category, t.type]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "finance-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV exported successfully!");
  };

  const handleAdd = (item) => {
    setTransactions(prev => [item, ...prev]);
    showToast("Transaction added!");
    setFormVisible(false);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(x => x.id !== id));
    showToast("Transaction removed", "info");
  };

  const obs = observations();
  const topCat = highestSpendingCategory();

  return (
    <div className={`app-shell ${darkMode ? "dark" : "light"}`}>
      {/* Ambient Particles */}
      <div className="particles-layer" aria-hidden="true">
        {particles.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "↻"}</span>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-orb" />
          <div>
            <div className="brand-name">WealthPulse</div>
            <div className="brand-sub">Finance Dashboard</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activeNav === item.label && <span className="nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="role-badge">
            <span className={`role-dot ${role}`} />
            <span>{role === "admin" ? "Administrator" : "View Only"}</span>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀" : "☽"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {activeNav}
              <span className="title-accent" />
            </h1>
            <p className="page-date">Sunday, April 5, 2026</p>
          </div>
          <div className="topbar-controls">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="ctrl-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="amount">By Amount</option>
            </select>
            <select className="ctrl-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            {role === "admin" && (
              <>
                <button className="ctrl-btn outline" onClick={exportCSV}>↓ Export</button>
                <button className="ctrl-btn outline" onClick={fetchMockTransactions}>⟳ Sync API</button>
                <button
                  className="ctrl-btn primary"
                  onClick={() => setFormVisible(!formVisible)}
                >
                  {formVisible ? "✕ Close" : "+ Add"}
                </button>
              </>
            )}
          </div>
        </header>

        {/* Add Transaction Form */}
        {role === "admin" && (
          <div className={`form-panel ${formVisible ? "form-open" : ""}`}>
            <TransactionForm onAdd={handleAdd} />
          </div>
        )}

        {/* KPI Cards */}
        {activeNav === "Dashboard" && (
        <section className="kpi-grid">
          <div className="kpi-card kpi-balance">
            <div className="kpi-glow" />
            <div className="kpi-icon-wrap">◎</div>
            <div className="kpi-meta">
              <span className="kpi-label">Net Balance</span>
              <span className="kpi-value"><AnimatedNumber value={balance} /></span>
            </div>
            <div className="kpi-sparkbar">
              <div className="sparkfill" style={{ width: `${Math.min(100, savingsRate)}%` }} />
            </div>
            <span className="kpi-sub">{savingsRate}% savings rate</span>
          </div>

          <div className="kpi-card kpi-income">
            <div className="kpi-icon-wrap">↑</div>
            <div className="kpi-meta">
              <span className="kpi-label">Total Income</span>
              <span className="kpi-value income-val"><AnimatedNumber value={income} /></span>
            </div>
            <span className="kpi-sub">{transactions.filter(t => t.type === "income").length} entries</span>
          </div>

          <div className="kpi-card kpi-expense">
            <div className="kpi-icon-wrap">↓</div>
            <div className="kpi-meta">
              <span className="kpi-label">Total Expense</span>
              <span className="kpi-value expense-val"><AnimatedNumber value={expense} /></span>
            </div>
            <span className="kpi-sub">{transactions.filter(t => t.type === "expense").length} entries</span>
          </div>

          <div className="kpi-card kpi-insight">
            <div className="kpi-icon-wrap">{obs.icon}</div>
            <div className="kpi-meta">
              <span className="kpi-label">Insight</span>
              <span className="kpi-value-sm">{obs.text}</span>
            </div>
            <span className="kpi-sub">Top: {topCat.name} {topCat.amount ? `₹${topCat.amount}` : ""}</span>
          </div>

          <div className="kpi-card kpi-monthly">
            <div className="kpi-icon-wrap">📅</div>
            <div className="kpi-meta">
              <span className="kpi-label">Monthly Overview</span>
              {monthlyComparison().length > 0 ? (
                <div className="monthly-bars">
                  {monthlyComparison().slice(-4).map((m, i) => (
                    <div key={i} className="month-bar-wrap">
                      <span className="month-label">{m.month.split(" ")[0]}</span>
                      <div className="month-bars">
                        <div className="bar-income" style={{ height: `${Math.min(100, (m.income / (m.income + m.expense || 1)) * 100)}%` }} />
                        <div className="bar-expense" style={{ height: `${Math.min(100, (m.expense / (m.income + m.expense || 1)) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="kpi-value-sm">No data</span>
              )}
            </div>
            <span className="kpi-sub">{monthlyComparison().length} month(s) tracked</span>
          </div>
        </section>
        )}

        {/* Charts - Show on Dashboard and Insights */}
        {(activeNav === "Dashboard" || activeNav === "Insights") && (
        <section className="charts-grid">
          <div className="chart-panel chart-wide">
            <div className="chart-header">
              <span className="chart-title">Balance Trajectory</span>
              <span className="chart-badge">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f5c4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00f5c4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="balance" stroke="#00f5c4" strokeWidth={2.5} fill="url(#balGrad)" dot={{ r: 4, fill: "#00f5c4", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-panel chart-narrow">
            <div className="chart-header">
              <span className="chart-title">Spend Breakdown</span>
            </div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={4}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `₹${val}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((d, i) => (
                    <div key={i} className="legend-row">
                      <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="legend-name">{d.name}</span>
                      <span className="legend-val">₹{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-chart">No expense data yet</div>
            )}
          </div>
        </section>
        )}

        {/* Transaction Table - Show on Dashboard and Transactions */}
        {(activeNav === "Dashboard" || activeNav === "Transactions") && (
        <section className="table-section">
          <div className="table-header">
            <span className="chart-title">Transactions</span>
            <span className="table-count">{filteredData.length} records</span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  {role === "admin" && <th></th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((t, idx) => (
                  <tr key={t.id} style={{ animationDelay: `${idx * 0.04}s` }} className="table-row-anim">
                    <td className="td-date">{t.date}</td>
                    <td>
                      <span className="cat-chip">{t.category}</span>
                    </td>
                    <td>
                      <span className={`type-badge ${t.type}`}>
                        {t.type === "income" ? "↑" : "↓"} {t.type}
                      </span>
                    </td>
                    <td className={`td-amount ${t.type}`}>₹{t.amount.toLocaleString()}</td>
                    {role === "admin" && (
                      <td>
                        <button className="del-btn" onClick={() => handleDelete(t.id)}>✕</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="empty-state">No transactions match your search</div>
            )}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}

function TransactionForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !category.trim()) {
      return;
    }
    onAdd({
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: Number(amount),
      category: category.trim(),
      type,
    });
    setAmount("");
    setCategory("");
    setType("expense");
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Amount</label>
        <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Category</label>
        <input type="text" placeholder="e.g. Food, Rent..." value={category} onChange={e => setCategory(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">Add Transaction →</button>
    </form>
  );
}