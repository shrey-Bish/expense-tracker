// src/app/App.tsx
import { useEffect, useRef, useState } from "react";
import { ExpenseProvider } from "../state/ExpenseContext";
import { AppShell } from "../ui/components/AppShell";
import { SummaryCards } from "../ui/components/SummaryCards";
import { FilterBar } from "../ui/components/FilterBar";
import { ExpenseList } from "../ui/components/ExpenseList";
import { useExpenseStore } from "../state/ExpenseContext";
import { Modal } from "../ui/components/Modal";
import { ExpenseForm } from "../ui/components/ExpenseForm";

type Toast = { id: number; msg: string; type: "success" | "error" | "info" };
let toastCounter = 0;

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="status">
          <span className="toast__dot" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Dashboard
function DashboardPage() {
  const { state, dispatch } = useExpenseStore();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevExpenses = useRef(state.expenses);

  function showToast(msg: string, type: Toast["type"] = "success") {
    const id = ++toastCounter;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }

  // Watch for expense count changes to show toasts
  useEffect(() => {
    const prev = prevExpenses.current;
    const curr = state.expenses;

    if (curr.length > prev.length) {
      showToast("Expense added successfully", "success");
    } else if (curr.length < prev.length) {
      showToast("Expense deleted", "error");
    } else if (curr !== prev && curr.length === prev.length) {
      // Same length but different reference = an update happened
      const hasUpdate = curr.some((e, i) => {
        const match = prev.find((p) => p.id === e.id);
        return match && match.updatedAt !== e.updatedAt;
      });
      if (hasUpdate) showToast("Expense updated", "info");
    }

    prevExpenses.current = curr;
  }, [state.expenses]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Overview</h1>
        <p className="page-header__sub">Track, manage, and analyse your spending.</p>
      </div>

      <SummaryCards />

      <section className="panel--combined">
        <div className="combined-head">
          <div>
            <div className="combined-title">Expenses</div>
            <div className="combined-subtitle">Filter, sort, and manage your entries.</div>
          </div>
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: "OPEN_ADD_MODAL" })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New expense
          </button>
        </div>

        <div className="combined-body">
          <FilterBar />
          <div className="combined-divider" />
          <ExpenseList />
        </div>
      </section>

      {state.modalOpen && (
        <Modal
          title={state.modalMode === "edit" ? "Edit expense" : "Add new expense"}
          subtitle={
            state.modalMode === "edit"
              ? "Update the details below and save."
              : "Fill in the details below to record a new expense."
          }
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <ExpenseForm />
        </Modal>
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </ExpenseProvider>
  );
}