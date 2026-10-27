import '../dashboard-extras.css';

export default function Dashboard({ students, loading }) {
  const total = students.length;

  const counts = new Map();
  students.forEach((s) => {
    const label = s.department.trim();
    const key = label.toLowerCase();
    const entry = counts.get(key) || { label, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  });

  const ranked = [...counts.values()].sort((a, b) => b.count - a.count);
  const departments = ranked.length;
  const top = ranked[0];
  const latest = students[0]; // the API returns newest first
  const shown = ranked.slice(0, 5);

  return (
    <>
      <section className="dashboard" aria-label="Summary">
        <div className="dash-main">
          <span className="dash-number" aria-live="polite" data-testid="total-students">
            {loading && total === 0 ? '-' : total}
          </span>
          <span className="dash-caption">registered {total === 1 ? 'student' : 'students'}</span>
        </div>
        <dl className="dash-stats">
          <div>
            <dt>Departments</dt>
            <dd>{departments}</dd>
          </div>
          <div>
            <dt>Largest department</dt>
            <dd>
              {top ? top.label : 'None yet'}
              {top && (
                <span className="dash-sub">
                  {top.count} {top.count === 1 ? 'student' : 'students'}
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt>Latest addition</dt>
            <dd>{latest ? latest.name : 'None yet'}</dd>
          </div>
        </dl>
      </section>

      {shown.length > 0 && (
        <section className="insights" aria-label="Department breakdown">
          <div className="insights-head">
            <h2>Department breakdown</h2>
            <span>{total} total</span>
          </div>
          <ul className="bars">
            {shown.map((d, i) => {
              const pct = Math.max(4, Math.round((d.count / total) * 100));
              return (
                <li key={d.label} className="bar-row">
                  <span className="bar-label">{d.label}</span>
                  <span className="bar-track" aria-hidden="true">
                    <span className="bar-fill" style={{ width: `${pct}%`, animationDelay: `${i * 90}ms` }} />
                  </span>
                  <span className="bar-value">{d.count}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
