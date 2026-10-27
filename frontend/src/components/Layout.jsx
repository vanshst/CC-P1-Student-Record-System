function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Layout({ children }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-brand">
            <img
              src="/logo-bit.jpeg"
              alt="Bajaj Institute of Technology Wardha Logo"
              className="header-logo"
            />
            <div className="header-text">
              <span className="header-eyebrow">{greeting()}, Vansh</span>
              <h1>BAJAJ INSTITUTE OF TECHNOLOGY WARDHA</h1>
              <p>Student Information Management System</p>
            </div>
          </div>

          <div className="header-user" aria-label="Dashboard owner">
            <span className="user-avatar" aria-hidden="true">VT</span>
            <span className="user-meta">
              <span className="user-label">Managed by</span>
              <strong className="user-name">Vansh Thulwar</strong>
            </span>
            <span className="status-dot" title="System online" aria-label="System online" />
          </div>
        </div>
      </header>

      <main id="main" className="container">
        {children}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            BAJAJ INSTITUTE OF TECHNOLOGY WARDHA &middot; Cloud Computing CA2 &middot; React on Netlify, Express on Render, MongoDB Atlas
          </p>
          <p className="footer-credit">Designed &amp; built by <strong>Vansh Thulwar</strong></p>
        </div>
      </footer>
    </>
  );
}
