// src/ui/components/SummaryCards.tsx
import { useMemo } from "react";
import { selectTotals } from "../../state/selectors";
import { useExpenseStore } from "../../state/ExpenseContext";
import { WalletIcon, ChartIcon, TagIcon, StarIcon } from "./icons";
import { centsToDollars } from "../../domain/expense";

export const CATEGORY_COLORS: Record<string, string> = {
  Housing:        "#fb923c",
  Food:           "#f59e0b",
  Transportation: "#60a5fa",
  Utilities:      "#34d399",
  Healthcare:     "#c084fc",
  Entertainment:  "#f472b6",
  Education:      "#4ade80",
  Shopping:       "#facc15",
  Other:          "#94a3b8",
};

export function SummaryCards() {
  const { state } = useExpenseStore();
  const totals = selectTotals(state);
  const avg = totals.count ? Math.round(totals.totalCents / totals.count) : 0;

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of state.expenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amountCents;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [state.expenses]);

  const topCategory = categoryTotals[0];
  const maxCents = categoryTotals[0]?.[1] ?? 1;

  return (
    <>
      <section className="summary-grid" aria-label="Summary">
        <div className="summary-card highlight">
          <div className="summary-card__icon-row">
            <div className="summary-card__icon"><WalletIcon /></div>
          </div>
          <div className="summary-card__label">Total Spent</div>
          <div className="summary-card__value">{centsToDollars(totals.totalCents)}</div>
          <div className="summary-card__meta">All time</div>
        </div>

        <div className="summary-card">
          <div className="summary-card__icon-row">
            <div className="summary-card__icon"><TagIcon /></div>
          </div>
          <div className="summary-card__label">Entries</div>
          <div className="summary-card__value">{totals.count}</div>
          <div className="summary-card__meta">Tracked expenses</div>
        </div>

        <div className="summary-card">
          <div className="summary-card__icon-row">
            <div className="summary-card__icon"><ChartIcon /></div>
          </div>
          <div className="summary-card__label">Average</div>
          <div className="summary-card__value">{centsToDollars(avg)}</div>
          <div className="summary-card__meta">Per entry</div>
        </div>

        <div className="summary-card">
          <div className="summary-card__icon-row">
            <div className="summary-card__icon"><StarIcon /></div>
          </div>
          <div className="summary-card__label">Top Category</div>
          <div
            className="summary-card__value"
            style={{ fontSize: topCategory ? "17px" : "24px", paddingTop: topCategory ? "4px" : "0" }}
          >
            {topCategory ? topCategory[0] : "—"}
          </div>
          <div className="summary-card__meta">
            {topCategory ? centsToDollars(topCategory[1]) : "No data yet"}
          </div>
        </div>
      </section>

      {categoryTotals.length > 0 && (
        <section className="breakdown-section" aria-label="Spending by category">
          <div className="breakdown-header">
            <div className="breakdown-title">Spending by category</div>
            <div className="breakdown-count">{categoryTotals.length} categories</div>
          </div>
          {categoryTotals.map(([cat, cents]) => (
            <div className="breakdown-row" key={cat}>
              <div className="breakdown-cat">{cat}</div>
              <div className="breakdown-track">
                <div
                  className="breakdown-fill"
                  style={{
                    width: `${(cents / maxCents) * 100}%`,
                    background: CATEGORY_COLORS[cat] ?? "#94a3b8",
                  }}
                />
              </div>
              <div className="breakdown-amt">{centsToDollars(cents)}</div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}