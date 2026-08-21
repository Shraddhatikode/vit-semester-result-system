import React from 'react';

const Navbar = ({ currentView, onNavigate }) => {
  return (
    <header className="vit-navbar sticky-top">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        <a
          href="#"
          className="vit-brand nav-trigger"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard-view');
          }}
        >
          <div className="vit-badge-logo">VIT</div>
          <div>
            <h1 className="vit-brand-title">VIT RESULT PORTAL</h1>
            <p className="vit-brand-subtitle">Vishwakarma Institute of Technology, Pune</p>
          </div>
        </a>

        <ul className="nav nav-pills my-2 my-lg-0">
          <li className="nav-item">
            <a
              className={`nav-link vit-nav-item ${currentView === 'dashboard-view' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('dashboard-view');
              }}
            >
              <i className="bi bi-grid-1x2-fill"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link vit-nav-item ${currentView === 'prepare-view' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('prepare-view');
              }}
            >
              <i className="bi bi-file-earmark-plus-fill"></i> Prepare Result
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link vit-nav-item ${currentView === 'search-view' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('search-view');
              }}
            >
              <i className="bi bi-search"></i> Search Result
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link vit-nav-item ${currentView === 'students-view' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('students-view');
              }}
            >
              <i className="bi bi-people-fill"></i> All Students
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
