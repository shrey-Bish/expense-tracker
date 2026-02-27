import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { localExpenseRepository } from "../data/expenseRepository";
import { expenseReducer, initialState } from "./expenseReducer";
import type { ExpenseAction, ExpenseState } from "./expenseReducer";

type ExpenseStore = {
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
};

const Ctx = createContext<ExpenseStore | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // init
  useEffect(() => {
    const expenses = localExpenseRepository.getAll();
    dispatch({ type: "INIT", expenses });
  }, []);

  // persist
  useEffect(() => {
    localExpenseRepository.saveAll(state.expenses);
  }, [state.expenses]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpenseStore(): ExpenseStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useExpenseStore must be used within ExpenseProvider");
  return v;
}