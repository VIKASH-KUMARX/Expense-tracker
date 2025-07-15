import React from 'react'
import '../style/Home.css'

export default function Home() {
  return (
    <div className="app-info-container">
      <div className="app-info-content">
        <h1 className='title'>Welcome to <span className="highlight"> EXPE </span> </h1>
        <h1><span className='highlight'>Smart</span> Expense Tracker</h1>
        <p>This app helps you keep track of your <span className="highlight">income</span> and <span className="highlight">expenses</span> in an intuitive way.</p>
        <p>Visualize your spending with <span className="highlight">charts</span> and apply powerful <span className="highlight">filters</span> to analyze your data.</p>

        <div className="feature-list">
          <div className="feature-card">
            <h3>📅 Organized by Time</h3>
            <p>View summaries for today, week, month & year.</p>
          </div>
          <div className="feature-card">
            <h3>🔍 Advanced Filtering</h3>
            <p>Filter by price, item, category, source & date.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Visual Insights</h3>
            <p>Analyze your data through bar, line, and donut charts.</p>
          </div>
          <div className="feature-card">
            <h3>📌 Simple Interface</h3>
            <p>Fast, clean and mobile-friendly UI to manage your cashflow.</p>
          </div>
        </div>

        <p className="footer-text">© 2025 Expense Tracker | Designed with care</p>
      </div>
    </div>
  )
}
