// src/ui/components/SummaryCards.tsx
import React from "react";
import { selectTotals } from "../../state/selectors";
import { useExpenseStore } from "../../state/ExpenseContext";
import { WalletIcon, ChartIcon, TagIcon } from "./icons";
import { centsToDollars } from "../../domain/expense";

export function SummaryCards() {
  const { state } = useExpenseStore();
  const totals = selectTotals(state);
  const avg = totals.count ? Math.round(totals.totalCents / totals.count) : 0;

  return (
    <section className="summary-grid" aria-label="Summary">
      <div className="summary-card highlight">
        <div className="summary-card__left">
          <div className="summary-card__icon"><WalletIcon /></div>
          <div>
            <div className="summary-card__label">Total</div>
            <div className="summary-card__value">{centsToDollars(totals.totalCents)}</div>
          </div>
        </div>
        <div className="summary-card__meta">All-time</div>
      </div>

      <div className="summary-card">
        <div className="summary-card__left">
          <div className="summary-card__icon"><TagIcon /></div>
          <div>
            <div className="summary-card__label">Entries</div>
            <div className="summary-card__value">{totals.count}</div>
          </div>
        </div>
        <div className="summary-card__meta">Tracked items</div>
      </div>

      <div className="summary-card">
        <div className="summary-card__left">
          <div className="summary-card__icon"><ChartIcon /></div>
          <div>
            <div className="summary-card__label">Average</div>
            <div className="summary-card__value">{centsToDollars(avg)}</div>
          </div>
        </div>
        <div className="summary-card__meta">Per entry</div>
      </div>
    </section>
  );
}