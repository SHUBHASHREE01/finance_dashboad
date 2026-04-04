***

# Finance Dashboard

A clean, responsive, and interactive frontend dashboard built with React to track personal finances, visualize spending patterns, and manage transactions. 

This project was built to fulfill the Finance Dashboard UI assignment requirements, focusing on UI design, component structuring, state management, and user experience.


## Features Implemented

This dashboard fulfills 100% of the core requirements and includes several optional enhancements.

### Dashboard Overview
* **Summary Cards:** Instantly view Total Balance, Total Income, and Total Expenses.
* **Balance Trend (Time-based Viz):** A dynamic line chart tracking account balance over time.
* **Spending Breakdown (Categorical Viz):** A colorful pie chart visualizing expenses by category.

### Transactions Management
* **Data Table:** Displays an interactive list of transactions (Date, Amount, Category, Type).
* **Search & Filtering:** Search bar to instantly filter transactions by category.
* **Sorting:** Toggle sorting between "Latest" (date-based) and "Amount" (highest to lowest).
* **CRUD Operations:** Admins can quickly add new income/expense records and delete existing ones. 

### Simulated Role-Based UI
* Includes a toggle switch in the Top Bar to simulate `Viewer` and `Admin` roles.
* **Viewer:** Read-only access to charts, tables, and insights.
* **Admin:** Unlocks the "Add Transaction" form and the "Delete" action in the data table.

### Automated Insights
* **Highest Spending Category:** Automatically calculates and displays the category draining the most funds.
* **Monthly Comparison:** Aggregates income vs. expense data by month.
* **Smart Observations:** Provides dynamic feedback based on the user's spending habits (e.g., "Good job! You are saving money.").

### Optional Enhancements Included
* **Data Persistence:** Uses browser `localStorage` to save and load transactions automatically.
* **CSV Export:** One-click generation and download of transaction data into a `.csv` file.
* **Animations:** Smooth `fadeUp` CSS animations on load and interactive transition effects on charts (via Recharts).
* **Responsive Design:** Fluid layout handling that utilizes CSS Flexbox to adapt to different screen sizes.

## Tech Stack

* **Framework:** React 19 (via Vite for fast compilation)
* **Styling:** Vanilla CSS3 (Custom gradients, flexbox layouts)
* **Charts:** [Recharts](https://recharts.org/) (Declarative React components for D3 charts)

## Project Structure

All core logic and components are housed within `src/App.jsx` for ease of review, modularized into functional React components:
* `<Sidebar />`: Main navigation layout.
* `<TopBar />`: Houses the role toggle, search, sort, and export functions.
* `<TransactionForm />`: The input form for adding records (Admin only).
* `<SummaryCards />` & `<Insights />`: Renders calculated financial metrics.
* `<BalanceChart />` & `<SpendingChart />`: Recharts wrappers for data visualization.
* `<TransactionsTable />`: The main data grid.

## Running Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SHUBHASHREE01/finance_dashboad.git
   cd finance_dashboard
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed.
   ```bash
   npm install
   # This will install React, ReactDOM, and Recharts
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the App:**
   Open `http://localhost:5173` (or the port provided by Vite) in your browser.

## Technical Approach & State Management

* **State:** Application state is managed entirely using React's native `useState` hooks. The central source of truth is the `transactions` array, from which all other metrics (balance, income, pie chart data, line chart data) are derived on the fly.
* **Effects:** The `useEffect` hook is utilized strictly for syncing the `transactions` state with `localStorage` upon initialization and subsequent updates.
* **Styling Strategy:** A mobile-first, fluid approach using Flexbox ensures the dashboard pieces `wrap` cleanly on smaller screens. 

---
*Created by Shubhashree TK*