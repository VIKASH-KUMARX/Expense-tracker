import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Filter.css';

export default function Filters({ type }) {
  const [data, setData] = useState([]);
  const [priceLimit, setPriceLimit] = useState('');
  const [itemName, setItemName] = useState('');
  const [categoryOrSource, setCategoryOrSource] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [options, setOptions] = useState([]);
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:4000/${type}`)
      .then(res => {
        setData(res.data);
        const field = type === 'cash-in' ? 'source' : 'category';
        const unique = [...new Set(res.data.map(item => item[field]).filter(Boolean))];
        setOptions(unique);
      })
      .catch(err => alert('Error fetching data: ' + err));
  }, [type]);

  useEffect(() => {
    let filtered = [...data];

    if (priceLimit) {
      filtered = filtered.filter(entry => {
        const amount = type === 'cash-in' ? entry.amount : entry.price;
        return Number(amount) <= Number(priceLimit);
      });
    }

    if (itemName && type === 'cash-out') {
      filtered = filtered.filter(entry => entry.item?.toLowerCase().includes(itemName.toLowerCase()));
    }

    if (categoryOrSource) {
      const field = type === 'cash-in' ? 'source' : 'category';
      filtered = filtered.filter(entry => entry[field]?.toLowerCase().includes(categoryOrSource.toLowerCase()));
    }

    if (date) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.datetime).toISOString().split('T')[0];
        return entryDate === date;
      });
    }

    if (month) {
      const [filterYear, filterMonth] = month.split('-').map(Number);
      filtered = filtered.filter(entry => {
        const d = new Date(entry.datetime);
        return d.getFullYear() === filterYear && d.getMonth() + 1 === filterMonth;
      });
    }

    if (year) {
      filtered = filtered.filter(entry => {
        const d = new Date(entry.datetime);
        return d.getFullYear().toString() === year;
      });
    }

    if (sortOrder) {
      filtered.sort((a, b) => {
        const priceA = Number(type === 'cash-in' ? a.amount : a.price);
        const priceB = Number(type === 'cash-in' ? b.amount : b.price);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    setFilteredData(filtered);
  }, [priceLimit, itemName, categoryOrSource, date, month, year, data, type, sortOrder]);

  return (
    <div className="filter-tools">
      <h3> {type === 'cash-in' ? 'Income' : 'Expense'} Filter </h3>
      <div className="filters">
        <input type="number" placeholder="Max Price" value={priceLimit} onChange={e => setPriceLimit(e.target.value)} />
        {type === 'cash-out' && (
          <input type="text" placeholder="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
        )}

        <select className='select-opt' value={categoryOrSource} onChange={e => setCategoryOrSource(e.target.value)}>
          <option value="">{type === 'cash-out' ? 'Select Category' : 'Select Source'}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>

        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="month" placeholder="month" value={month} onChange={e => setMonth(e.target.value)} />
        <input type="number" placeholder="Year (e.g., 2025)" value={year} onChange={e => setYear(e.target.value)} />
        <select className='select-opt' value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
        <button className="reset-input-button" onClick={() => {
            setPriceLimit('');
            setItemName('');
            setCategoryOrSource('');
            setDate('');
            setMonth('');
            setYear('');
          }}>
        Reset Filters </button>
      </div>

      <table className="analyze-table">
        <thead>
          <tr>
            <th>Amount</th>
            {type === 'cash-out' && <th>Item</th>}
            <th>{type === 'cash-in' ? 'Source' : 'Category'}</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
        { filteredData.length!==0 ? (filteredData.map((entry, i) => {
            const dateObj = new Date(entry.datetime);
            const dateStr = dateObj.toLocaleDateString();
            const amount = type === 'cash-in' ? entry.amount : entry.price;
            return (
              <tr key={i}>
                <td>{amount}</td>
                {type === 'cash-out' && <td>{entry.item}</td>}
                <td>{type === 'cash-in' ? entry.source : entry.category}</td>
                <td>{dateStr}</td>
              </tr>
            );
          })) :
          (<tr>
            <td colSpan={type === 'cash-out' ? 5 : 4} className="no-data">
              No data available
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
