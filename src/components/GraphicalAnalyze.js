import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';
import '../style/GraphicalAnalyze.css'

export default function GraphicalAnalyze({ chartType, type }) {
  const [rawData, setRawData] = useState([]);
  const [viewBy, setViewBy] = useState('week');
  const [filterBy, setFilterBy] = useState('price');
  const [processedData, setProcessedData] = useState([]);
  const [customDate, setCustomDate] = useState({
    week: getCurrentDate(),
    month: getCurrentMonth(),
    year: getCurrentYear()
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#8884d8'];

  function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }
  function getCurrentMonth() {
    return `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  }
  function getCurrentYear() {
    return `${new Date().getFullYear()}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = type === 'cash-in' ? 'http://localhost:4000/cash-in' : 'http://localhost:4000/cash-out';
        const res = await axios.get(url);
        setRawData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [type]);

  useEffect(() => {
    const grouped = processData(rawData, viewBy, filterBy, type);
    setProcessedData(grouped);
  }, [rawData, viewBy, filterBy, type, customDate]);

  function processData(data, viewBy, filterBy, type) {
    const group = {};
    const filterDate = new Date(
      viewBy === 'week' ? customDate.week :
      viewBy === 'month' ? customDate.month + "-01" :
      viewBy === 'year' ? customDate.year + "-01-01" :
      "2000-01-01"
    );

    data.forEach(entry => {
      const dt = new Date(entry.datetime);
      let include = true;

      if (viewBy === 'week') {
        const selectedWeek = new Date(filterDate);
        const currentWeekStart = new Date(selectedWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay()));
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        include = dt >= currentWeekStart && dt <= currentWeekEnd;
      } else if (viewBy === 'month') {
        include = dt.getMonth() === new Date(filterDate).getMonth() &&
                  dt.getFullYear() === new Date(filterDate).getFullYear();
      } else if (viewBy === 'year') {
        include = dt.getFullYear() === parseInt(customDate.year);
      }

      if (!include && viewBy !== 'years') return;

      let key = '';
      switch (viewBy) {
        case 'week': key = dt.toLocaleDateString('en-US', { weekday: 'long' }); break;
        case 'month': key = `Week ${Math.ceil(dt.getDate() / 7)}`; break;
        case 'year': key = dt.toLocaleDateString('en-US', { month: 'long' }); break;
        case 'years': key = dt.getFullYear().toString(); break;
        default: key = 'Unknown';
      }

      let label = '';
      if (filterBy === 'price') label = 'Price : ' + (type === 'cash-in' ? entry.amount : entry.price);
      else if (filterBy === 'item') label = entry.item || 'N/A';
      else if (filterBy === 'category' || filterBy === 'source') label = entry.category || entry.source || 'N/A';
      else if (filterBy === 'date') label = dt.toLocaleDateString();
      else label = key;

      const amount = type === 'cash-in' ? Number(entry.amount) : Number(entry.price);
      group[label] = (group[label] || 0) + amount;
    });

    return Object.entries(group).map(([label, total]) => ({ label, total }));
  }

  const renderChart = () => {
    if (!processedData.length) return <p className="graph-empty">No data available</p>;

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={processedData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={processedData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'donut') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={processedData}
              dataKey="total"
              nameKey="label"
              outerRadius={110}
              innerRadius={50}
              label
            >
              {processedData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(prev => ({
      ...prev,
      [viewBy]: e.target.value
    }));
  };

  const renderDateInput = () => {
    if (viewBy === 'week') {
      return (
        <input
          type="date"
          value={customDate.week}
          onChange={handleCustomDateChange}
          className="date-input"
        />
      );
    } else if (viewBy === 'month') {
      return (
        <input
          type="month"
          value={customDate.month}
          onChange={handleCustomDateChange}
          className="date-input"
        />
      );
    } else if (viewBy === 'year') {
      return (
        <input
          type="number"
          min="2000"
          max="2099"
          value={customDate.year}
          onChange={handleCustomDateChange}
          className="date-input"
        />
      );
    }
    return null;
  };

  return (
    <div className="graph-analyze-container">
      <div className="graph-analyze-controls-row">
        <div className="view-by">
          <span>Compare:</span>
          <button className={`sel-btn ${viewBy === 'week' ? 'active' : ''}`} onClick={() => setViewBy('week')}>Date</button>
          <button className={`sel-btn ${viewBy === 'month' ? 'active' : ''}`} onClick={() => setViewBy('month')}>Month</button>
          <button className={`sel-btn ${viewBy === 'year' ? 'active' : ''}`} onClick={() => setViewBy('year')}>Year</button>
          <button className={`sel-btn ${viewBy === 'years' ? 'active' : ''}`} onClick={() => setViewBy('years')}>All Years</button>
          {viewBy !== 'years' && renderDateInput()}
        </div>

        <div className="filter-by">
          <span>Filter By:</span>
          <button className={`sel-btn ${filterBy === 'price' ? 'active' : ''}`} onClick={() => setFilterBy('price')}>Amount</button>
          {type === 'cash-out' && (
            <button className={`sel-btn ${filterBy === 'item' ? 'active' : ''}`} onClick={() => setFilterBy('item')}>Item</button>
          )}
          <button
            className={`sel-btn ${filterBy === (type === 'cash-in' ? 'source' : 'category') ? 'active' : ''}`}
            onClick={() => setFilterBy(type === 'cash-in' ? 'source' : 'category')}
          >
            {type === 'cash-in' ? 'Source' : 'Category'}
          </button>
          <button className={`sel-btn ${filterBy === 'date' ? 'active' : ''}`} onClick={() => setFilterBy('date')}>Date</button>
        </div>
      </div>

      <div className="graph-analyze-content">
        {renderChart()}
        <div className="graph-total">
          Total: ₹{processedData.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
