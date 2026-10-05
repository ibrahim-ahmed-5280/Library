import type { Report } from '../../../shared/types'

export default function OverviewCharts({ data }: { data: Report }) {
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date()
    date.setUTCDate(1)
    date.setUTCMonth(date.getUTCMonth() - 11 + index)
    const key = date.toISOString().slice(0, 7)
    return { month: key, count: data.monthly.find((item) => item._id === key)?.issued ?? 0 }
  })
  const max = Math.max(1, ...months.map((item) => item.count))
  const points = months
    .map((item, index) => `${35 + index * 44},${170 - (item.count / max) * 130}`)
    .join(' ')
  const states = ['available', 'on_loan', 'retired'].map((status) => ({
    status,
    count: data.inventory.find((item) => item._id === status)?.count ?? 0,
  }))
  const maxCopies = Math.max(1, ...states.map((item) => item.count))
  return (
    <div className="overview-charts">
      <section className="panel">
        <h2>Monthly borrowing</h2>
        <p className="muted">Last 12 months · UTC</p>
        <svg
          className="circulation-chart"
          viewBox="0 0 560 215"
          role="img"
          aria-label={`Monthly borrowing: ${months.map((item) => `${item.month}: ${item.count}`).join(', ')}`}
        >
          {[0, 0.5, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1="35"
                x2="525"
                y1={170 - ratio * 130}
                y2={170 - ratio * 130}
                className="chart-grid"
              />
              <text x="3" y={174 - ratio * 130}>
                {Math.round(max * ratio)}
              </text>
            </g>
          ))}
          <polyline points={points} className="chart-line" />
          {months.map((item, index) => (
            <g key={item.month}>
              <circle
                cx={35 + index * 44}
                cy={170 - (item.count / max) * 130}
                r="4"
                className="chart-point"
              >
                <title>
                  {item.month}: {item.count} loans
                </title>
              </circle>
              <text x={35 + index * 44} y="198" textAnchor="middle">
                {item.month.slice(5)}
              </text>
            </g>
          ))}
        </svg>
        <details>
          <summary>View borrowing data</summary>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Loans issued</th>
              </tr>
            </thead>
            <tbody>
              {months.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
      <section className="panel">
        <h2>Inventory availability</h2>
        <div className="inventory-bars">
          {states.map((item) => (
            <div key={item.status}>
              <div className="chart-bar-label">
                <span>{item.status.replaceAll('_', ' ')}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar"
                  style={{ width: `${(item.count / maxCopies) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="muted">
          {states.reduce((total, item) => total + item.count, 0)} copies recorded in total.
        </p>
      </section>
    </div>
  )
}
