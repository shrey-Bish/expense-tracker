// src/state/expenseReducer.ts
import type { CategoryFilter, Expense, SortKey } from "../domain/expense";

export type ModalMode = "add" | "edit";

export type ExpenseState = {
  expenses: Expense[];
  filterCategory: CategoryFilter;
  search: string;
  sort: SortKey;

  // UI state
  modalOpen: boolean;
  modalMode: ModalMode;
  editingId: string | null;
};

export type ExpenseAction =
  | { type: "INIT"; expenses: Expense[] }
  | { type: "ADD"; expense: Expense }
  | { type: "UPDATE"; expense: Expense }
  | { type: "DELETE"; id: string }
  | { type: "SET_FILTER_CATEGORY"; category: CategoryFilter }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_SORT"; sort: SortKey }
  | { type: "OPEN_ADD_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; id: string }
  | { type: "CLOSE_MODAL" };

export const initialState: ExpenseState = {
  expenses: [],
  filterCategory: "All",
  search: "",
  sort: "newest",
  modalOpen: false,
  modalMode: "add",
  editingId: null,
};

export function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case "INIT":
      return { ...state, expenses: action.expenses };

    case "OPEN_ADD_MODAL":
      return { ...state, modalOpen: true, modalMode: "add", editingId: null };

    case "OPEN_EDIT_MODAL":
      return { ...state, modalOpen: true, modalMode: "edit", editingId: action.id };

    case "CLOSE_MODAL":
      return { ...state, modalOpen: false, editingId: null, modalMode: "add" };

    case "ADD":
      return {
        ...state,
        expenses: [action.expense, ...state.expenses],
        modalOpen: false,
        modalMode: "add",
        editingId: null,
      };

    case "UPDATE":
      return {
        ...state,
        expenses: state.expenses.map((e) => (e.id === action.expense.id ? action.expense : e)),
        modalOpen: false,
        modalMode: "add",
        editingId: null,
      };

    case "DELETE":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) };

    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.category };

    case "SET_SEARCH":
      return { ...state, search: action.search };

    case "SET_SORT":
      return { ...state, sort: action.sort };

    default:
      return state;
  }
}