import type { Expense } from "../domain/expense";
import { loadExpenses, saveExpenses } from "./storage";

export type ExpenseRepository = {
  getAll(): Expense[];
  saveAll(expenses: Expense[]): void;
};

export const localExpenseRepository: ExpenseRepository = {
  getAll() {
    return loadExpenses();
  },
  saveAll(expenses) {
    saveExpenses(expenses);
  },
};