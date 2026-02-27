import type { ExpenseState } from "./expenseReducer";
import type { Expense } from "../domain/expense";

export function selectEditingExpense(state: ExpenseState): Expense | null {
  if (!state.editingId) return null;
  return state.expenses.find((e) => e.id === state.editingId) ?? null;
}

export function selectVisibleExpenses(state: ExpenseState): Expense[] {
  const q = state.search.trim().toLowerCase();

  let list = state.expenses;

  if (state.filterCategory !== "All") {
    list = list.filter((e) => e.category === state.filterCategory);
  }

  if (q) {
    list = list.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    });
  }

  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (state.sort) {
      case "newest":
        return b.occurredAt.localeCompare(a.occurredAt);
      case "oldest":
        return a.occurredAt.localeCompare(b.occurredAt);
      case "amount_desc":
        return b.amountCents - a.amountCents;
      case "amount_asc":
        return a.amountCents - b.amountCents;
      case "title_asc":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return sorted;
}

export function selectTotals(state: ExpenseState): { totalCents: number; count: number } {
  const totalCents = state.expenses.reduce((sum, e) => sum + e.amountCents, 0);
  return { totalCents, count: state.expenses.length };
}