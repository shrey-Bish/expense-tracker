// src/ui/components/ExpenseList.tsx
import { useMemo, useState } from "react";
import { useExpenseStore } from "../../state/ExpenseContext";
import { selectVisibleExpenses } from "../../state/selectors";
import { centsToDollars } from "../../domain/expense";
import { EmptyState } from "./EmptyState";
import { CATEGORY_COLORS } from "./SummaryCards";

export function ExpenseList() {
  const { state, dispatch } = useExpenseStore();
  const visible = useMemo(() => selectVisibleExpenses(state), [state]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function handleConfirmDelete(id: string) {
    dispatch({ type: "DELETE", id });
    setConfirmingId(null);
  }

  if (visible.length === 0) {
    const hasExpenses = state.expenses.length > 0;
    return (
      <EmptyState
        title={hasExpenses ? "No matching expenses" : "No expenses yet"}
        description={
          hasExpenses
            ? "Try adjusting your filters or search term."
            : "Hit '+ New expense' above to add your first entry."
        }
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="expense-table" role="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th className="col--date">Date</th>
            <th className="col--amount">Amount</th>
            <th className="col--actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((e) => (
            <tr key={e.id}>
              <td>
                <div className="title-main">{e.title}</div>
                {e.description && (
                  <div className="title-desc">{e.description}</div>
                )}
              </td>
              <td>
                <span
                  className="category-pill"
                  style={{ background: CATEGORY_COLORS[e.category] ?? "#E6E6E6" }}
                >
                  {e.category}
                </span>
              </td>
              <td className="col--date">
                {new Date(e.occurredAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="col--amount">
                <span className="amount-value">{centsToDollars(e.amountCents)}</span>
              </td>
              <td className="col--actions">
                {confirmingId === e.id ? (
                  <div className="delete-confirm">
                    <span className="delete-confirm__label">Sure?</span>
                    <button
                      className="action-btn danger confirm"
                      onClick={() => handleConfirmDelete(e.id)}
                    >
                      Yes
                    </button>
                    <button
                      className="action-btn cancel-del"
                      onClick={() => setConfirmingId(null)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="action-btn"
                      onClick={() => dispatch({ type: "OPEN_EDIT_MODAL", id: e.id })}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => setConfirmingId(e.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}