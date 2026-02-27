import type { Expense } from "../domain/expense";

const KEY = "expense-tracker:v1";

type Persisted = {
  version: 1;
  expenses: Expense[];
};

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Persisted;
    if (parsed?.version !== 1 || !Array.isArray(parsed.expenses)) return [];
    return parsed.expenses;
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  const payload: Persisted = { version: 1, expenses };
  localStorage.setItem(KEY, JSON.stringify(payload));
}