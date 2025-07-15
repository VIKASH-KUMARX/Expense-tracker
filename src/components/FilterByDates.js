import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Filter.css'

export default function FilterByDates({ type }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("today");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/${type}`)
      .then(res => setData(res.data))
      .catch(err => alert("Error fetching data: " + err));
  }, [type]);

  useEffect(() => {
    if (!data.length) return;

    const now = new Date();

    const isSameDay = (date1, date2) => 
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    const isSameWeek = (date1, date2) => {
      const firstDayOfWeek = new Date(date2);
      firstDayOfWeek.setDate(date2.getDate() - date2.getDay()); // Sunday
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      return date1 >= firstDayOfWeek && date1 <= lastDayOfWeek;
    };

    const isSameMonth = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth();

    const isSameYear = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear();

    const filtered = data.filter(entry => {
      const entryDate = new Date(entry.datetime);
      switch (filter) {
        case 'today': return isSameDay(entryDate, now);
        case 'week': return isSameWeek(entryDate, now);
        case 'month': return isSameMonth(entryDate, now);
        case 'year': return isSameYear(entryDate, now);
        default: return true;
      }
    });

    filtered.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    setFilteredData(filtered);
  }, [data, filter]);

  const total = filteredData.reduce((sum, item) => {
    return sum + parseFloat(item.amount || item.price || 0);
  }, 0);

  return (
    <div className="analyze-container">
      <div className="filter-buttons">
        <button onClick={() => setFilter('today')} className={filter === 'today' ? 'active' : ''}>Today</button>
        <button onClick={() => setFilter('week')} className={filter === 'week' ? 'active' : ''}>This Week</button>
        <button onClick={() => setFilter('month')} className={filter === 'month' ? 'active' : ''}>This Month</button>
        <button onClick={() => setFilter('year')} className={filter === 'year' ? 'active' : ''}>This Year</button>
      </div>

      <div className="analyze-results">
        <h3>{filter.toUpperCase()} {type === 'cash-in' ? 'Income' : 'Expense'} Summary</h3>
        <p className="total-text">Total: ₹{total}</p>
        <table className="analyze-table">
            <thead>
            <tr>
                <th>Amount (₹)</th>
                <th>{type === 'cash-in' ? 'Source' : 'Item'}</th>
                {type === 'cash-out' && <th>Category</th>}
                <th>Date</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            { filteredData.length!==0 ? (filteredData.map((item, index) => {
                const dateObj = new Date(item.datetime);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();
                return (
                <tr key={index}>
                    <td>{type === 'cash-in' ? item.amount : item.price}</td>
                    <td>{type === 'cash-in' ? item.source : item.item}</td>
                    {type === 'cash-out' && <td>{item.category}</td>}
                    <td>{date}</td>
                    <td>{time}</td>
                </tr>
                );
            }))
            :
            (<tr>
              <td colSpan={type === 'cash-out' ? 5 : 4} className="no-data">
                No data available
              </td>
            </tr>) }
            </tbody>
        </table>
      </div>
    </div>
  );
}
