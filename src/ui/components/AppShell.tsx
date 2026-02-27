// src/ui/components/AppShell.tsx
import React from "react";
import Sidebar from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar-shell">
        <Sidebar />
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar__left">
            <div className="brand-compact">
              <div className="brand-compact__logo" aria-hidden>
                <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#E6FFFA" />
                  <path d="M9 18c2-3 5-6 9-6s7 3 9 6" stroke="#00A78E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="12" r="1.6" fill="#00A78E"/>
                </svg>
              </div>
              <div className="brand-compact__title">Expense Tracker</div>
            </div>
          </div>

          <div className="topbar__right">
            <div className="avatar" title="You">S</div>
          </div>
        </header>

        <main className="workspace">{children}</main>

        <footer className="app-footer">
          <div>Shrey Bishnoi</div>
        </footer>
      </div>
    </div>
  );
}