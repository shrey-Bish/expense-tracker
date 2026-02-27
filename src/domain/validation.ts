import type { ExpenseDraft } from "./expense";

export type ValidationErrors = Partial<Record<keyof ExpenseDraft, string>>;

export function validateDraft(d: ExpenseDraft): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!d.title.trim()) errors.title = "Title is required.";
  if (!d.category) errors.category = "Category is required.";

  // Integer dollars required
  if (!d.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (!/^\d+$/.test(d.amount.trim())) {
    errors.amount = "Amount must be an integer (e.g., 12).";
  } else {
    const n = Number(d.amount);
    if (!Number.isSafeInteger(n)) errors.amount = "Amount must be a safe integer.";
    if (n <= 0) errors.amount = "Amount must be greater than 0.";
  }

  if (!d.occurredAt) errors.occurredAt = "Date is required.";

  return errors;
}

export function hasErrors(e: ValidationErrors): boolean {
  return Object.keys(e).length > 0;
}