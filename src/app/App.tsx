// src/app/App.tsx

import { ExpenseProvider } from "../state/ExpenseContext";
import { AppShell } from "../ui/components/AppShell";
import { SummaryCards } from "../ui/components/SummaryCards";
import { FilterBar } from "../ui/components/FilterBar";
import { ExpenseList } from "../ui/components/ExpenseList";
import { useExpenseStore } from "../state/ExpenseContext";
import { Modal } from "../ui/components/Modal";
import { ExpenseForm } from "../ui/components/ExpenseForm";

function DashboardPage() {
  const { state, dispatch } = useExpenseStore();

  return (
    <>
      <SummaryCards />

      <section className="panel--combined">
        <div className="combined-head">
          <div>
            <div className="combined-title">Expenses</div>
            <div className="combined-subtitle">Filter, sort, and manage your entries.</div>
          </div>

          <button className="btn-primary" onClick={() => dispatch({ type: "OPEN_ADD_MODAL" })}>
            + New expense
          </button>
        </div>

        <div className="combined-body">
          <FilterBar />
          <div className="combined-divider" />
          <ExpenseList />
        </div>
      </section>

      {state.modalOpen ? (
        <Modal
          title={state.modalMode === "edit" ? "Edit expense" : "Add expense"}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <ExpenseForm />
        </Modal>
      ) : null}
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