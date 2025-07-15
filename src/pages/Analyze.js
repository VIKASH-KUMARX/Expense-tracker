import React, { useState } from 'react';
import AnalyzeByDates from '../components/FilterByDates';
import Filters from '../components/Filters';
import GraphicalAnalyze from '../components/GraphicalAnalyze';
import '../style/Analyze.css'

export default function Analyze() {
  const [section, setSection] = useState('date');
  const [type, setType] = useState('cash-out');
  const [chartType, setChartType] = useState('donut');

  const renderComponent = () => {
    if (section === 'date') {
      return <AnalyzeByDates type={type} />;
    } else if (section === 'filter') {
      return <Filters type={type} />;
    } else if (section === 'graph') {
      return <GraphicalAnalyze type={type} chartType={chartType} />;
    }
    return null;
  };

  return (
    <div className="analyze-container">

      <div className="analyze-nav">
        {/* Left: Section buttons */}
        <div className="analyze-nav-left">
          <button
            onClick={() => setSection('date')}
            className={section === 'date' ? 'active' : ''}
          >
            Analyze by Date
          </button>
          <button
            onClick={() => setSection('filter')}
            className={section === 'filter' ? 'active' : ''}
          >
            Analyze by Filter
          </button>
          <button
            onClick={() => setSection('graph')}
            className={section === 'graph' ? 'active' : ''}
          >
            Graphical Analyze
          </button>
        </div>

        {/* Right: Type + Chart selection (only when graph section) */}
        <div className="analyze-nav-right">
          {section === 'graph' && (
            <>
              <button
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'active' : ''}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('donut')}
                className={chartType === 'donut' ? 'active' : ''}
              >
                Donut Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'active' : ''}
              >
                Line Chart
              </button>
            </>
          )}
          <button
            onClick={() => setType('cash-in')}
            className={type === 'cash-in' ? 'active' : ''}
          >
            Income
          </button>
          <button
            onClick={() => setType('cash-out')}
            className={type === 'cash-out' ? 'active' : ''}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="analyze-content">
        {renderComponent()}
      </div>
    </div>
  );
}
