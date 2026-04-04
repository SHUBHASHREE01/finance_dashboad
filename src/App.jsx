import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

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
  const [form, setForm] = useState({ category: "", type: "expense" });
  const [tempAmount, setTempAmount] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions"));
    if (stored) setTransactions(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expense;

  const lineData = transactions.reduce((acc, t) => {
    const last = acc.length ? acc[acc.length - 1].balance : 0;
    const newBalance = t.type === "income" ? last + t.amount : last - t.amount;
    acc.push({ date: t.date, balance: newBalance });
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
    .sort((a, b) =>
      sort === "amount" ? b.amount - a.amount : new Date(b.date) - new Date(a.date)
    );

  // Insights
  const highestSpendingCategory = () => {
    const expenses = transactions.filter(t => t.type === "expense");
    if (!expenses.length) return "No data";
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
    return `${maxCategory} (₹${categoryTotals[maxCategory]})`;
  };

  const monthlyComparison = () => {
    const monthTotals = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      acc[month][t.type] += t.amount;
      return acc;
    }, {});
    return monthTotals;
  };

  const observations = () => {
    if (!transactions.length) return "No transactions yet";
    if (expense > income) return "You spent more than you earned!";
    if (income > expense) return "Good job! You are saving money.";
    return "Income and expenses are balanced.";
  };

  // Sidebar component
  const Sidebar = () => {
    const menu = ["Dashboard", "Transactions", "Insights"];
    return (
      <div className="sidebar">
        <h2>💰 Finance</h2>
        <ul>
          {menu.map((item, idx) => (
            <li key={idx}>
              <span className="dot"></span> {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // TopBar component
  const TopBar = () => {
    const exportCSV = () => {
      if (!transactions.length) return alert("No transactions to export");

      const headers = ["Date", "Amount", "Category", "Type"];
      const rows = transactions.map(t => [t.date, t.amount, t.category, t.type]);
      let csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="top-bar">
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="amount">Amount</option>
        </select>
        <button onClick={exportCSV}>Export CSV</button>
      </div>
    );
  };

  // TransactionForm component
  const TransactionForm = () => {
    const handleAdd = () => {
      if (!tempAmount || !form.category) return alert("Fill all fields");

      const newItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        amount: Number(tempAmount),
        category: form.category,
        type: form.type,
      };

      setTransactions([newItem, ...transactions]);
      setTempAmount("");
      setForm({ category: "", type: "expense" });
    };

    return (
      <div className="form">
        <input
          type="text"
          placeholder="Amount"
          value={tempAmount}
          onChange={e => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) setTempAmount(val);
          }}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button onClick={handleAdd}>Add</button>
      </div>
    );
  };

  // Summary cards
  const SummaryCards = () => (
    <div className="cards">
      <div className="card balance">Balance ₹{balance}</div>
      <div className="card income">Income ₹{income}</div>
      <div className="card expense">Expense ₹{expense}</div>
    </div>
  );

  // Insights
  const Insights = () => {
    const monthTotals = monthlyComparison();
    return (
      <div className="cards">
        <div className="card">
          <h3>Highest Spending Category</h3>
          <p>{highestSpendingCategory()}</p>
        </div>
        <div className="card">
          <h3>Monthly Comparison</h3>
          {Object.keys(monthTotals).map(month => (
            <p key={month}>
              {month}: Income ₹{monthTotals[month].income} / Expense ₹{monthTotals[month].expense}
            </p>
          ))}
        </div>
        <div className="card">
          <h3>Observation</h3>
          <p>{observations()}</p>
        </div>
      </div>
    );
  };

  // Charts
  const BalanceChart = () => (
    <div className="chart-card">
      <h3>Balance Trend</h3>
      {lineData.length ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data</p>
      )}
    </div>
  );

  const SpendingChart = () => {
    const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
    return (
      <div className="chart-card">
        <h3>Spending</h3>
        {pieData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No data</p>
        )}
      </div>
    );
  };

  // Table
  const TransactionsTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Type</th>
          {role === "admin" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {filteredData.length ? (
          filteredData.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>₹{t.amount}</td>
              <td>{t.category}</td>
              <td className={t.type}>{t.type}</td>
              {role === "admin" && (
                <td>
                  <button
                    onClick={() =>
                      setTransactions(transactions.filter(x => x.id !== t.id))
                    }
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={role === "admin" ? 5 : 4} style={{ textAlign: "center" }}>
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        {role === "admin" && <TransactionForm />}
        <SummaryCards />
        <Insights />
        <div className="charts">
          <BalanceChart />
          <SpendingChart />
        </div>
        <TransactionsTable />
      </div>
    </div>
  );
}