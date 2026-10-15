export default function Layout({ children }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-brand">
          <img 
            src="/logo-bit.jpeg" 
            alt="Bajaj Institute of Technology Wardha Logo" 
            className="header-logo" 
          />
          <div className="header-text">
            <h1>BAJAJ INSTITUTE OF TECHNOLOGY WARDHA</h1>
            <p>Student Information Management System</p>
          </div>
        </div>
      </header>

      <main id="main" className="container">
        {children}
      </main>

      <footer className="site-footer">
        <div className="container">
          BAJAJ INSTITUTE OF TECHNOLOGY WARDHA &middot; Cloud Computing CA2 &middot; React on Netlify, Express on Render, MongoDB Atlas
        </div>
      </footer>
    </>
  );
}