// src/ui/components/ExpenseList.tsx
import React, { useMemo } from "react";
import { useExpenseStore } from "../../state/ExpenseContext";
import { selectVisibleExpenses } from "../../state/selectors";
import { centsToDollars } from "../../domain/expense";

const CATEGORY_COLORS: Record<string,string> = {
  Housing: "#FFB4A2",
  Food: "#FFD6A5",
  Transportation: "#BDE0FE",
  Utilities: "#C7F9CC",
  Healthcare: "#F7C6FF",
  Entertainment: "#FFE3E3",
  Education: "#D0F4DE",
  Shopping: "#FFE6A7",
  Other: "#E6E6E6",
};

export function ExpenseList() {
  const { state, dispatch } = useExpenseStore();
  const visible = useMemo(() => selectVisibleExpenses(state), [state]);

  if (visible.length === 0) {
    return (
      <div className="table-empty">
        <div className="empty-illustration">📄</div>
        <div className="empty-title">No expenses yet</div>
        <div className="muted">Add an expense to get started</div>
      </div>
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
          {visible.map((e, i) => (
            <tr key={e.id} className={i % 2 === 0 ? "zebra" : ""}>
              <td className="title-cell">
                <div className="title-main">{e.title}</div>
                <div className="muted small">{e.description}</div>
              </td>
              <td>
                <span className="category-pill" style={{ background: CATEGORY_COLORS[e.category] ?? "#E6E6E6" }}>
                  {e.category}
                </span>
              </td>
              <td className="col--date">{new Date(e.occurredAt).toLocaleDateString()}</td>
              <td className="col--amount">{centsToDollars(e.amountCents)}</td>
              <td className="col--actions">
  <button className="action-btn" onClick={() => dispatch({ type: "OPEN_EDIT_MODAL", id: e.id })}>
    Edit
  </button>
  <button className="action-btn danger" onClick={() => dispatch({ type: "DELETE", id: e.id })}>
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}