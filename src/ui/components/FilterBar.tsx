// src/ui/components/FilterBar.tsx
import { CATEGORIES } from "../../domain/expense";
import { useExpenseStore } from "../../state/ExpenseContext";
import { selectVisibleExpenses } from "../../state/selectors";
import type { CategoryFilter, SortKey } from "../../domain/expense";
import { useMemo } from "react";

export function FilterBar() {
  const { state, dispatch } = useExpenseStore();
  const visible = useMemo(() => selectVisibleExpenses(state), [state]);

  const hasActiveFilters = state.filterCategory !== "All" || state.search.trim() !== "";

  return (
    <div className="filter-controls" aria-label="Filters">
      <div className="filter-row">
        <div className="field">
          <label className="label" htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            className="input"
            value={state.filterCategory}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER_CATEGORY", category: e.target.value as CategoryFilter })
            }
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field field--grow">
          <label className="label" htmlFor="search">Search</label>
          <input
            id="search"
            className="input"
            placeholder="Search title, description, category…"
            value={state.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", search: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="sort">Sort by</label>
          <select
            id="sort"
            className="input"
            value={state.sort}
            onChange={(e) => dispatch({ type: "SET_SORT", sort: e.target.value as SortKey })}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount_desc">Amount: High → Low</option>
            <option value="amount_asc">Amount: Low → High</option>
            <option value="title_asc">Title: A → Z</option>
          </select>
        </div>
      </div>

      <div className="filter-result-count">
        Showing <strong>{visible.length}</strong> of {state.expenses.length} expenses
        {hasActiveFilters && (
          <button
            style={{
              marginLeft: 4,
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: 11,
              cursor: "pointer",
              padding: "0 4px",
              textDecoration: "underline",
            }}
            onClick={() => {
              dispatch({ type: "SET_FILTER_CATEGORY", category: "All" });
              dispatch({ type: "SET_SEARCH", search: "" });
            }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}