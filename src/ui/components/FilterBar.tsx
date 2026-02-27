
import { CATEGORIES } from "../../domain/expense";
import { useExpenseStore } from "../../state/ExpenseContext";
import type { CategoryFilter, SortKey } from "../../domain/expense";

export function FilterBar() {
  const { state, dispatch } = useExpenseStore();

  return (
    <div className="filter-controls" aria-label="Filters">
      <div className="filter-row">
        <div className="field">
          <label className="label" htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            className="input"
            value={state.filterCategory}
            onChange={(e) => dispatch({ type: "SET_FILTER_CATEGORY", category: e.target.value as CategoryFilter })}
          >
            <option value="All">All</option>
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
            placeholder="Title, description, category…"
            value={state.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", search: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="sort">Sort</label>
          <select
            id="sort"
            className="input"
            value={state.sort}
            onChange={(e) => dispatch({ type: "SET_SORT", sort: e.target.value as SortKey })}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_desc">Amount (High → Low)</option>
            <option value="amount_asc">Amount (Low → High)</option>
            <option value="title_asc">Title (A → Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}