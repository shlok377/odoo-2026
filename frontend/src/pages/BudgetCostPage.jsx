import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Download,
  Trash2,
  X,
  Plane,
  Hotel,
  Utensils,
  MapPin,
  MoreHorizontal,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

import "bootstrap/dist/css/bootstrap.min.css";

/* =========================================================
   ITINERA — BUDGET & COST BREAKDOWN
========================================================= */

const COLORS = [
  "#F5EFE9",
  "#E2D0CA",
  "#C5AAA5",
  "#9C7775",
  "#724B50",
];

const ICONS = {
  Transport: Plane,
  Stay: Hotel,
  Meals: Utensils,
  Activities: MapPin,
  Other: MoreHorizontal,
};

const CURRENCIES = {
  INR: { symbol: "₹", rate: 1 },
  EUR: { symbol: "€", rate: 95 },
  USD: { symbol: "$", rate: 87 },
  GBP: { symbol: "£", rate: 112 },
};

/* =========================================================
   INITIAL DATA
========================================================= */

const INITIAL_TRIP = {
  name: "European Summer",
  destination: "Paris · Amsterdam · Rome",
  budget: 120000,
  estimated: 86400,
};

const INITIAL_EXPENSES = [
  {
    id: 1,
    title: "Mumbai → Paris flight",
    category: "Transport",
    date: "2026-10-10",
    amount: 32000,
  },
  {
    id: 2,
    title: "Paris apartment",
    category: "Stay",
    date: "2026-10-10",
    amount: 18050,
  },
  {
    id: 3,
    title: "Louvre Museum",
    category: "Activities",
    date: "2026-10-11",
    amount: 2100,
  },
  {
    id: 4,
    title: "Dinner in Paris",
    category: "Meals",
    date: "2026-10-11",
    amount: 4200,
  },
  {
    id: 5,
    title: "Canal tour",
    category: "Activities",
    date: "2026-10-13",
    amount: 7125,
  },
  {
    id: 6,
    title: "Amsterdam dinner",
    category: "Meals",
    date: "2026-10-13",
    amount: 3400,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function money(value, currency = "INR") {
  const symbol = CURRENCIES[currency]?.symbol || "₹";
  return (
    symbol +
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

function totalExpenses(expenses) {
  return expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );
}

function categoryData(expenses) {
  const categories = {};
  expenses.forEach((expense) => {
    categories[expense.category] =
      (categories[expense.category] || 0) + Number(expense.amount || 0);
  });

  const total = Object.values(categories).reduce(
    (sum, value) => sum + value,
    0
  );

  return Object.entries(categories).map(([name, amount]) => ({
    name,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  }));
}

function dailyData(expenses) {
  const days = {};
  expenses.forEach((expense) => {
    days[expense.date] =
      (days[expense.date] || 0) + Number(expense.amount || 0);
  });

  return Object.entries(days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount], index) => ({
      day: `Day ${index + 1}`,
      date,
      amount,
    }));
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function BudgetCostPage({ onNavigate }) {
  const [trip, setTrip] = useState(INITIAL_TRIP);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [addOpen, setAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [message, setMessage] = useState("");

  const spent = useMemo(() => totalExpenses(expenses), [expenses]);
  const categories = useMemo(() => categoryData(expenses), [expenses]);
  const daily = useMemo(() => dailyData(expenses), [expenses]);

  const remaining = trip.budget - spent;
  const percentage = trip.budget > 0 ? (spent / trip.budget) * 100 : 0;
  const dailyBudget = trip.budget / 6;

  function notify(text) {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function addExpense(data) {
    const rate = CURRENCIES[data.currency]?.rate || 1;
    setExpenses((current) => [
      ...current,
      {
        id: Date.now(),
        title: data.title,
        category: data.category,
        date: data.date,
        amount: Number(data.amount) * rate,
      },
    ]);
    setAddOpen(false);
    notify("Expense added successfully.");
  }

  function deleteExpense(id) {
    setExpenses((current) =>
      current.filter((expense) => expense.id !== id)
    );
    notify("Expense removed.");
  }

  function updateBudget(value) {
    setTrip((current) => ({
      ...current,
      budget: Number(value),
    }));
    setBudgetOpen(false);
    notify("Budget updated.");
  }

  return (
    <div className="itinera-budget">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Neuton:wght@300;400;600;700;800&family=Pangolin&display=swap');

        * {
          box-sizing: border-box;
        }

        .itinera-budget {
          min-height: 100vh;
          background: linear-gradient(180deg, #591D26 0%, #591D26 48%, #501A22 72%, #42141B 100%);
          color: #F5EFE9;
          font-family: "Neuton", serif;
          font-size: 18px;
          line-height: 1.6;
        }

        .itinera-container {
          width: min(1380px, calc(100% - 70px));
          margin: 0 auto;
        }

        /* NAVIGATION */
        .it-nav {
          min-height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(245, 239, 233, .7);
        }

        .it-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border: 0;
          background: transparent;
          color: #F5EFE9;
          font-family: "Neuton";
          font-size: 17px;
          cursor: pointer;
          transition: transform .2s ease;
        }

        .it-back:hover {
          transform: translateX(-3px);
        }

        .it-brand {
          font-family: "Neuton", serif;
          font-size: 35px;
          font-weight: 400;
          letter-spacing: -.03em;
        }

        .it-page-number {
          color: #D8C8C3;
          font-size: 14px;
          letter-spacing: .12em;
        }

        /* HERO */
        .it-hero {
          padding: 75px 0 80px;
        }

        .it-hero-meta {
          display: flex;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(245, 239, 233, .28);
        }

        .it-hero-meta span {
          color: #D8C8C3;
          font-size: 13px;
          letter-spacing: .14em;
        }

        .it-hero-grid {
          display: grid;
          grid-template-columns: 1.3fr .7fr;
          gap: 100px;
          padding-top: 55px;
        }

        .it-hero h1 {
          margin: 0;
          font-family: "Neuton", serif;
          font-size: clamp(70px, 9vw, 130px);
          font-weight: 400;
          line-height: .78;
          letter-spacing: -.05em;
          color: #F5EFE9;
        }

        .it-hero h1 em {
          font-style: normal;
          font-weight: 300;
        }

        .it-hero-description {
          align-self: end;
          max-width: 430px;
        }

        .it-hero-description p {
          margin: 0;
          color: #D8C8C3;
          font-size: 21px;
          line-height: 1.7;
        }

        .it-note {
          margin-top: 18px;
          color: #F5EFE9;
          font-family: "Pangolin", cursive;
          font-size: 19px;
        }

        /* SUMMARY */
        .it-trip {
          border-top: 1px solid rgba(245, 239, 233, .7);
          border-bottom: 1px solid rgba(245, 239, 233, .7);
        }

        .it-trip-heading {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(245, 239, 233, .28);
        }

        .it-trip-heading span {
          color: #D8C8C3;
          font-size: 12px;
          letter-spacing: .15em;
        }

        .it-trip-heading strong {
          color: #F5EFE9;
          font-size: 23px;
          font-weight: 400;
        }

        .it-summary {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
        }

        .it-summary-card {
          min-height: 190px;
          padding: 30px;
          border-left: 1px solid rgba(245, 239, 233, .28);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform .2s ease;
        }

        .it-summary-card:first-child {
          border-left: 0;
        }

        .it-summary-card:hover {
          transform: translateY(-4px);
        }

        .it-summary-card span {
          color: #D8C8C3;
          font-size: 13px;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .it-summary-card strong {
          color: #F5EFE9;
          font-size: 47px;
          line-height: 1;
          font-weight: 400;
        }

        .it-summary-card small {
          color: #D8C8C3;
          font-size: 16px;
        }

        /* ACTIONS */
        .it-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 35px 0 75px;
        }

        .it-btn {
          min-height: 48px;
          padding: 10px 19px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #F5EFE9;
          background: transparent;
          color: #F5EFE9;
          font-family: "Neuton";
          font-size: 17px;
          cursor: pointer;
          transition: transform .2s ease, background .2s ease, color .2s ease;
        }

        .it-btn:hover {
          transform: translateY(-2px);
          background: #F5EFE9;
          color: #591D26;
        }

        .it-btn.primary {
          background: #F5EFE9;
          color: #591D26;
        }

        /* SECTIONS */
        .it-section {
          padding: 80px 0;
          border-top: 1px solid rgba(245, 239, 233, .28);
        }

        .it-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
          margin-bottom: 48px;
        }

        .it-section-number {
          color: #F5EFE9;
          font-family: "Pangolin", cursive;
          font-size: 21px;
        }

        .it-section-heading h2 {
          margin: 7px 0 0;
          color: #F5EFE9;
          font-family: "Neuton";
          font-size: clamp(54px, 6vw, 78px);
          line-height: .85;
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .it-section-heading p {
          max-width: 420px;
          margin: 0;
          color: #D8C8C3;
          font-size: 18px;
          line-height: 1.7;
        }

        /* COST BREAKDOWN */
        .it-cost-grid {
          display: grid;
          grid-template-columns: 1fr .8fr;
          gap: 100px;
          align-items: center;
        }

        .it-category {
          padding: 21px 0;
          border-bottom: 1px solid rgba(245, 239, 233, .28);
          transition: transform .2s ease;
        }

        .it-category-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .it-category-name {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #F5EFE9;
          font-size: 21px;
        }

        .it-category-index {
          color: #D8C8C3;
          font-size: 13px;
        }

        .it-category-value {
          color: #F5EFE9;
          font-size: 30px;
        }

        .it-track {
          height: 3px;
          background: rgba(245, 239, 233, .14);
        }

        .it-progress {
          height: 100%;
          background: #F5EFE9;
        }

        .it-donut {
          position: relative;
        }

        .it-donut-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .it-donut-label span {
          color: #D8C8C3;
          font-size: 12px;
          letter-spacing: .12em;
        }

        .it-donut-label strong {
          color: #F5EFE9;
          font-size: 42px;
          font-weight: 400;
        }

        /* DAILY SPENDING */
        .it-daily-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .it-daily-target small {
          display: block;
          color: #D8C8C3;
          font-size: 12px;
          letter-spacing: .12em;
        }

        .it-daily-target strong {
          color: #F5EFE9;
          font-size: 32px;
          font-weight: 400;
        }

        .it-chart {
          padding-top: 25px;
          border-top: 1px solid rgba(245, 239, 233, .7);
        }

        /* EXPENSES */
        .it-expenses {
          border-top: 1px solid rgba(245, 239, 233, .7);
        }

        .it-expense-head,
        .it-expense-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 45px;
          align-items: center;
        }

        .it-expense-head {
          min-height: 58px;
          color: #D8C8C3;
          font-size: 12px;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .it-expense-row {
          padding: 22px 0;
          border-top: 1px solid rgba(245, 239, 233, .28);
          transition: transform .2s ease;
        }

        .it-expense-row:hover {
          transform: translateX(5px);
        }

        .it-expense-title {
          color: #F5EFE9;
          font-size: 25px;
          font-weight: 400;
        }

        .it-expense-category {
          color: #F5EFE9;
          font-family: "Pangolin", cursive;
          font-size: 18px;
        }

        .it-expense-date {
          color: #D8C8C3;
          font-size: 16px;
        }

        .it-expense-amount {
          color: #F5EFE9;
          font-size: 25px;
          font-weight: 400;
        }

        .it-delete {
          border: 0;
          background: transparent;
          color: #F5EFE9;
          cursor: pointer;
          opacity: .5;
          transition: opacity .2s ease, transform .2s ease;
        }

        .it-delete:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        /* FOOTER */
        .it-footer {
          padding: 70px 0 25px;
          border-top: 1px solid rgba(245, 239, 233, .28);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #D8C8C3;
        }

        .it-footer-brand {
          color: #F5EFE9;
          font-size: 32px;
        }

        /* MODAL & OVERLAY */
        .it-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 5, 7, .75);
        }

        .it-modal {
          width: min(620px, 100%);
          max-height: 90vh;
          overflow: auto;
          padding: 38px;
          background: #591D26;
          border: 1px solid #F5EFE9;
        }

        .it-modal.small {
          width: min(500px, 100%);
        }

        .it-modal-head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .it-modal-head span {
          color: #D8C8C3;
          font-family: "Pangolin";
          font-size: 17px;
        }

        .it-modal-head h2 {
          margin: 5px 0 0;
          color: #F5EFE9;
          font-size: 48px;
          line-height: .9;
          font-weight: 400;
        }

        .it-modal-close {
          border: 0;
          background: transparent;
          color: #F5EFE9;
          cursor: pointer;
        }

        .it-modal label {
          display: block;
          margin-bottom: 20px;
          color: #F5EFE9;
          font-size: 17px;
        }

        .it-modal input,
        .it-modal select {
          width: 100%;
          margin-top: 7px;
          padding: 13px;
          border: 1px solid rgba(245, 239, 233, .7);
          outline: none;
          background: transparent;
          color: #F5EFE9;
          font-family: "Neuton";
          font-size: 17px;
        }

        .it-modal input:focus,
        .it-modal select:focus {
          border-color: #F5EFE9;
        }

        .it-modal option {
          background: #591D26;
          color: #F5EFE9;
        }

        .it-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 18px;
        }

        .it-error {
          margin: 10px 0;
          padding: 8px 12px;
          border-left: 3px solid #F5EFE9;
          color: #F5EFE9;
        }

        .it-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
        }

        .it-modal-actions button {
          padding: 10px 18px;
          cursor: pointer;
          font-family: "Neuton";
          font-size: 17px;
        }

        .it-cancel {
          border: 1px solid #F5EFE9;
          background: transparent;
          color: #F5EFE9;
        }

        .it-save {
          border: 1px solid #F5EFE9;
          background: #F5EFE9;
          color: #591D26;
        }

        /* TOAST */
        .it-toast {
          position: fixed;
          right: 25px;
          bottom: 25px;
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 18px;
          background: #F5EFE9;
          color: #591D26;
          font-size: 17px;
        }

        @media(max-width:1000px) {
          .it-hero-grid, .it-cost-grid { grid-template-columns: 1fr; }
          .it-summary { grid-template-columns: 1fr 1fr; }
        }

        @media(max-width:700px) {
          .itinera-container { width: calc(100% - 30px); }
          .it-page-number { display: none; }
          .it-hero h1 { font-size: 60px; }
          .it-hero-grid { gap: 40px; }
          .it-summary { grid-template-columns: 1fr; }
          .it-summary-card { border-left: 0; border-top: 1px solid rgba(245, 239, 233, .28); }
          .it-summary-card:first-child { border-top: 0; }
          .it-section-heading { flex-direction: column; align-items: flex-start; gap: 20px; }
          .it-section-heading h2 { font-size: 52px; }
          .it-daily-header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .it-expense-head { display: none; }
          .it-expense-row { grid-template-columns: 1fr auto; gap: 8px; }
          .it-expense-title { font-size: 23px; }
          .it-expense-amount { grid-column: 2; grid-row: 1 / span 2; }
          .it-delete { grid-column: 2; }
          .it-form-grid { grid-template-columns: 1fr; }
          .it-footer { flex-direction: column; align-items: flex-start; gap: 18px; }
        }
      `}</style>

      <div className="itinera-container">
        {/* NAV */}
        <nav className="it-nav">
          <button className="it-back" onClick={() => onNavigate('home')}>
            <ArrowLeft size={17} />
            My trips
          </button>
          <div className="it-brand">Itinera</div>
          <div className="it-page-number">09 / 17</div>
        </nav>

        {/* HERO */}
        <section className="it-hero">
          <div className="it-hero-meta">
            <span>BUDGET & COST</span>
            <span>{trip.name}</span>
          </div>

          <div className="it-hero-grid">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Budget,
              <br />
              <em>beautifully</em>
              <br />
              planned.
            </motion.h1>

            <div className="it-hero-description">
              <p>
                Keep the numbers simple so the journey stays unforgettable.
              </p>
              <div className="it-note">every rupee has a story ✦</div>
            </div>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="it-trip">
          <div className="it-trip-heading">
            <span>YOUR TRIP</span>
            <strong>{trip.destination}</strong>
          </div>

          <div className="it-summary">
            <Summary
              label="Total budget"
              value={money(trip.budget)}
              description="Your spending limit"
            />
            <Summary
              label="Estimated"
              value={money(trip.estimated)}
              description="Expected total"
            />
            <Summary
              label="Spent"
              value={money(spent)}
              description={`${Math.round(percentage)}% of budget`}
            />
            <Summary
              label={remaining >= 0 ? "Remaining" : "Over budget"}
              value={money(Math.abs(remaining))}
              description={remaining >= 0 ? "Still available" : "Needs attention"}
            />
          </div>
        </section>

        {/* BUTTONS */}
        <div className="it-actions">
          <button className="it-btn primary" onClick={() => setAddOpen(true)}>
            <Plus size={18} />
            Add expense
          </button>
          <button className="it-btn" onClick={() => setBudgetOpen(true)}>
            <Pencil size={17} />
            Edit budget
          </button>
          <button className="it-btn" onClick={() => window.print()}>
            <Download size={17} />
            Export
          </button>
        </div>

        {/* COST BREAKDOWN */}
        <section className="it-section">
          <SectionHeading
            number="01"
            title="Cost breakdown"
            description="See how your spending is distributed across the journey."
          />

          <div className="it-cost-grid">
            <div>
              {categories.map((category, index) => {
                const Icon = ICONS[category.name];
                return (
                  <motion.div
                    className="it-category"
                    key={category.name}
                    whileHover={{ x: 5 }}
                  >
                    <div className="it-category-top">
                      <div className="it-category-name">
                        <span className="it-category-index">
                          0{index + 1}
                        </span>
                        {Icon && <Icon size={19} />}
                        {category.name}
                      </div>
                      <div className="it-category-value">
                        {money(category.amount)}
                      </div>
                    </div>

                    <div className="it-track">
                      <motion.div
                        className="it-progress"
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="it-donut">
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    nameKey="name"
                    innerRadius={100}
                    outerRadius={135}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categories.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="it-donut-label">
                <span>SPENT</span>
                <strong>{money(spent)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* DAILY SPENDING */}
        <section className="it-section">
          <SectionHeading
            number="02"
            title="Daily spending"
            description="Watch the rhythm of your spending as the trip unfolds."
          />

          <div className="it-daily-header">
            <div className="it-note">keep it balanced ✦</div>
            <div className="it-daily-target">
              <small>DAILY TARGET</small>
              <strong>{money(dailyBudget)}</strong>
            </div>
          </div>

          <div className="it-chart">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={daily}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(245,239,233,.18)"
                  strokeDasharray="2 6"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#D8C8C3",
                    fontFamily: "Neuton",
                    fontSize: 16,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#D8C8C3",
                    fontFamily: "Neuton",
                    fontSize: 14,
                  }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [money(value), "Spent"]}
                  contentStyle={{
                    background: "#591D26",
                    border: "1px solid #F5EFE9",
                    color: "#F5EFE9",
                    borderRadius: 0,
                    fontFamily: "Neuton",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#F5EFE9"
                  radius={[2, 2, 0, 0]}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* EXPENSE TRACKER */}
        <section className="it-section">
          <SectionHeading
            number="03"
            title="Expense tracker"
            description="Every expense, in one place."
          />

          <div className="it-expenses">
            <div className="it-expense-head">
              <span>Expense</span>
              <span>Category</span>
              <span>Date</span>
              <span>Amount</span>
              <span />
            </div>

            <AnimatePresence>
              {expenses.map((expense) => (
                <motion.div
                  className="it-expense-row"
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <span className="it-expense-title">{expense.title}</span>
                  <span className="it-expense-category">{expense.category}</span>
                  <span className="it-expense-date">
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="it-expense-amount">{money(expense.amount)}</span>
                  <button
                    className="it-delete"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="it-footer">
          <div className="it-footer-brand">Itinera</div>
          <div className="it-note">plan less. experience more. ✦</div>
          <div>{trip.name}</div>
        </footer>
      </div>

      {/* ADD EXPENSE MODAL */}
      <AnimatePresence>
        {addOpen && (
          <ExpenseModal close={() => setAddOpen(false)} save={addExpense} />
        )}
      </AnimatePresence>

      {/* EDIT BUDGET MODAL */}
      <AnimatePresence>
        {budgetOpen && (
          <BudgetModal
            value={trip.budget}
            close={() => setBudgetOpen(false)}
            save={updateBudget}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="it-toast"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <Check size={17} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* SUMMARY COMPONENT */
function Summary({ label, value, description }) {
  return (
    <motion.div className="it-summary-card" whileHover={{ y: -4 }}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </motion.div>
  );
}

/* SECTION HEADING COMPONENT */
function SectionHeading({ number, title, description }) {
  return (
    <div className="it-section-heading">
      <div>
        <span className="it-section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}

/* EXPENSE MODAL COMPONENT */
function ExpenseModal({ close, save }) {
  const [form, setForm] = useState({
    title: "",
    category: "Transport",
    amount: "",
    currency: "INR",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Enter an expense name.");
      return;
    }
    if (!form.category) {
      setError("Select a category.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!form.date) {
      setError("Select a date.");
      return;
    }
    save(form);
  }

  return (
    <motion.div
      className="it-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="it-modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="it-modal-head">
          <div>
            <span>ADD TO JOURNEY</span>
            <h2>New expense.</h2>
          </div>
          <button className="it-modal-close" onClick={close}>
            <X />
          </button>
        </div>

        {error && <div className="it-error">{error}</div>}

        <form onSubmit={submit}>
          <label>
            Expense name
            <input
              placeholder="Hotel — Paris"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>

          <div className="it-form-grid">
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Transport">Transport</option>
                <option value="Stay">Stay</option>
                <option value="Meals">Meals</option>
                <option value="Activities">Activities</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Currency
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
              >
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </label>
          </div>

          <div className="it-form-grid">
            <label>
              Amount
              <input
                type="number"
                min="0"
                placeholder="4200"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </label>
          </div>

          <div className="it-modal-actions">
            <button type="button" className="it-cancel" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="it-save">
              Save expense
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* BUDGET MODAL COMPONENT */
function BudgetModal({ value, close, save }) {
  const [budget, setBudget] = useState(value);

  function submit(e) {
    e.preventDefault();
    if (budget && Number(budget) > 0) {
      save(budget);
    }
  }

  return (
    <motion.div
      className="it-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="it-modal small"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="it-modal-head">
          <div>
            <span>TRIP SPENDING LIMIT</span>
            <h2>Edit budget.</h2>
          </div>
          <button className="it-modal-close" onClick={close}>
            <X />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Total Budget (₹)
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>

          <div className="it-modal-actions">
            <button type="button" className="it-cancel" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="it-save">
              Save Budget
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
