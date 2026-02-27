// src/ui/components/ExpenseForm.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Expense, ExpenseDraft } from "../../domain/expense";
import { CATEGORIES, dollarsStringToCents, makeId, todayYMD } from "../../domain/expense";
import { validateDraft, hasErrors } from "../../domain/validation";
import type { ValidationErrors } from "../../domain/validation";
import { useExpenseStore } from "../../state/ExpenseContext";
import { selectEditingExpense } from "../../state/selectors";

function toDraft(e: Expense): ExpenseDraft {
  const occurredAt = e.occurredAt.slice(0, 10);
  return {
    title: e.title,
    description: e.description,
    category: e.category,
    amount: String(Math.round(e.amountCents / 100)),
    occurredAt,
  };
}

const defaultDraft: ExpenseDraft = {
  title: "",
  description: "",
  category: "",
  amount: "",
  occurredAt: todayYMD(),
};

export function ExpenseForm() {
  const { state, dispatch } = useExpenseStore();
  const editing = useMemo(() => selectEditingExpense(state), [state]);

  const [draft, setDraft] = useState<ExpenseDraft>(defaultDraft);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const isEditing = state.modalMode === "edit" && Boolean(editing);

  useEffect(() => {
    if (isEditing && editing) {
      setDraft(toDraft(editing));
      setErrors({});
    } else {
      setDraft(defaultDraft);
      setErrors({});
    }
  }, [isEditing, editing]);

  function set<K extends keyof ExpenseDraft>(key: K, value: ExpenseDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const now = new Date().toISOString();
    const occurredAtIso = new Date(`${draft.occurredAt}T12:00:00`).toISOString();

    if (isEditing && editing) {
      const updated: Expense = {
        ...editing,
        title: draft.title.trim(),
        description: draft.description.trim(),
        category: draft.category as any,
        amountCents: dollarsStringToCents(draft.amount.trim()),
        occurredAt: occurredAtIso,
        updatedAt: now,
      };
      dispatch({ type: "UPDATE", expense: updated });
      return;
    }

    const created: Expense = {
      id: makeId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category as any,
      amountCents: dollarsStringToCents(draft.amount.trim()),
      occurredAt: occurredAtIso,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "ADD", expense: created });
  }

  return (
    <form onSubmit={onSubmit} className="modal-form" noValidate>
      <div className="modal-grid">
        <div className="field field--span2">
          <label className="label" htmlFor="title">Title *</label>
          <input
            id="title"
            className={`input ${errors.title ? "input--error" : ""}`}
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g., Groceries shopping from walmart’s"
            maxLength={80}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>

        <div className="field">
          <label className="label" htmlFor="amount">Amount *</label>
          <input
            id="amount"
            inputMode="numeric"
            className={`input ${errors.amount ? "input--error" : ""}`}
            value={draft.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="e.g., 45"
          />
          {errors.amount && <div className="error">{errors.amount}</div>}
        </div>

        <div className="field">
          <label className="label" htmlFor="category">Category *</label>
          <select
            id="category"
            className={`input ${errors.category ? "input--error" : ""}`}
            value={draft.category}
            onChange={(e) => set("category", e.target.value as any)}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <div className="error">{errors.category}</div>}
        </div>

        <div className="field">
          <label className="label" htmlFor="date">Date *</label>
          <input
            id="date"
            type="date"
            className={`input ${errors.occurredAt ? "input--error" : ""}`}
            value={draft.occurredAt}
            onChange={(e) => set("occurredAt", e.target.value)}
          />
          {errors.occurredAt && <div className="error">{errors.occurredAt}</div>}
        </div>

        <div className="field field--span2">
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input input--textarea"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional notes"
            maxLength={200}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-primary" type="submit">
          {isEditing ? "Save changes" : "Add expense"}
        </button>
        <button className="btn-ghost" type="button" onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
          Cancel
        </button>
      </div>
    </form>
  );
}