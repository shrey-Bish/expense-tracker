// src/ui/components/ExpenseForm.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Expense, ExpenseDraft } from "../../domain/expense";
import { CATEGORIES, dollarsStringToCents, makeId, todayYMD } from "../../domain/expense";
import { validateDraft, hasErrors } from "../../domain/validation";
import type { ValidationErrors } from "../../domain/validation";
import { useExpenseStore } from "../../state/ExpenseContext";
import { selectEditingExpense } from "../../state/selectors";

function toDraft(e: Expense): ExpenseDraft {
  return {
    title: e.title,
    description: e.description,
    category: e.category,
    amount: String(Math.round(e.amountCents / 100)),
    occurredAt: e.occurredAt.slice(0, 10),
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
  const isEditing = state.modalMode === "edit" && Boolean(editing);

  const [draft, setDraft] = useState<ExpenseDraft>(defaultDraft);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editing) {
      setDraft(toDraft(editing));
    } else {
      setDraft({ ...defaultDraft, occurredAt: todayYMD() });
    }
    setErrors({});
    setSubmitted(false);
    // Auto-focus title field when modal opens
    setTimeout(() => titleRef.current?.focus(), 150);
  }, [isEditing, editing]);

  function set<K extends keyof ExpenseDraft>(key: K, value: ExpenseDraft[K]) {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      // Live re-validate only after first submit attempt
      if (submitted) setErrors(validateDraft(next));
      return next;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const now = new Date().toISOString();
    const occurredAtIso = new Date(`${draft.occurredAt}T12:00:00`).toISOString();

    if (isEditing && editing) {
      dispatch({
        type: "UPDATE",
        expense: {
          ...editing,
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category as any,
          amountCents: dollarsStringToCents(draft.amount.trim()),
          occurredAt: occurredAtIso,
          updatedAt: now,
        },
      });
    } else {
      dispatch({
        type: "ADD",
        expense: {
          id: makeId(),
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category as any,
          amountCents: dollarsStringToCents(draft.amount.trim()),
          occurredAt: occurredAtIso,
          createdAt: now,
          updatedAt: now,
        },
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="modal-form" noValidate>
      <div className="modal-grid">
        {/* Title */}
        <div className="field field--span2">
          <label className="label" htmlFor="ef-title">
            Title <span className="required" style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            ref={titleRef}
            id="ef-title"
            className={`input${errors.title ? " input--error" : ""}`}
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Groceries at Walmart"
            maxLength={80}
            autoComplete="off"
          />
          {errors.title && <div className="error">⚠ {errors.title}</div>}
        </div>

        {/* Amount */}
        <div className="field">
          <label className="label" htmlFor="ef-amount">
            Amount ($) <span className="required" style={{ color: "var(--danger)" }}>*</span>
          </label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input
              id="ef-amount"
              inputMode="numeric"
              className={`input${errors.amount ? " input--error" : ""}`}
              value={draft.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0"
            />
          </div>
          {errors.amount && <div className="error">⚠ {errors.amount}</div>}
        </div>

        {/* Category */}
        <div className="field">
          <label className="label" htmlFor="ef-category">
            Category <span className="required" style={{ color: "var(--danger)" }}>*</span>
          </label>
          <select
            id="ef-category"
            className={`input${errors.category ? " input--error" : ""}`}
            value={draft.category}
            onChange={(e) => set("category", e.target.value as any)}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <div className="error">⚠ {errors.category}</div>}
        </div>

        {/* Date */}
        <div className="field field--span2">
          <label className="label" htmlFor="ef-date">
            Date <span className="required" style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            id="ef-date"
            type="date"
            className={`input${errors.occurredAt ? " input--error" : ""}`}
            value={draft.occurredAt}
            onChange={(e) => set("occurredAt", e.target.value)}
          />
          {errors.occurredAt && <div className="error">⚠ {errors.occurredAt}</div>}
        </div>

        {/* Description */}
        <div className="field field--span2">
          <label className="label" htmlFor="ef-description">Description</label>
          <textarea
            id="ef-description"
            className="input input--textarea"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional note or context…"
            maxLength={200}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="btn-ghost"
          type="button"
          onClick={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          Cancel
        </button>
        <button className="btn-primary" type="submit">
          {isEditing ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
}