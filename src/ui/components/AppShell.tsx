// src/ui/components/AppShell.tsx
import React from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar-shell">
        <Sidebar />
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar__left">
            <div className="topbar__page-title">Dashboard</div>
          </div>
          <div className="topbar__right">
            <ThemeToggle />
            <div className="avatar" title="Shrey Bishnoi">S</div>
          </div>
        </header>

        <main className="workspace">{children}</main>

        <footer className="app-footer">
          Built by Shrey Bishnoi
        </footer>
      </div>
    </div>
  );
}