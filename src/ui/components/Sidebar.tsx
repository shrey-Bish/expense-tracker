// src/ui/components/Sidebar.tsx


export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar__top">
        <div className="sidebar__section-title">Overview</div>
        <a className="nav-item active" href="#" onClick={(e)=>e.preventDefault()}>Dashboard</a>
        <a className="nav-item" href="#" onClick={(e)=>e.preventDefault()}>Expenses</a>
        <a className="nav-item" href="#" onClick={(e)=>e.preventDefault()}>Reports</a>
      </div>

      <div className="sidebar__mid">
        <div className="sidebar__section-title">Manage</div>
        <a className="nav-item" href="#" onClick={(e)=>e.preventDefault()}>Categories</a>
        <a className="nav-item" href="#" onClick={(e)=>e.preventDefault()}>Settings</a>
      </div>
    </nav>
  );
}