import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../components/Auth'
import '../style/Profile.css'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { login, setLogin } = useContext(AuthContext);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const navigate = useNavigate()

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    axios.get('http://localhost:4000/cash-in')
      .then(res => {
        totalIncome = res.data.reduce((acc, val) => acc + parseFloat(val.amount), 0);
        return axios.get('http://localhost:4000/cash-out');
      })
      .then(res => {
        totalExpense = res.data.reduce((acc, val) => acc + parseFloat(val.price), 0);
        setSummary({ income: totalIncome, expense: totalExpense });
      })
      .catch(err => {
        alert('Error fetching data');
        console.error(err);
      });
  }, []);

  const handleLogout = () => {
    setLogin({ status: false });
    navigate('/')
  };

  const balance = summary.income - summary.expense;

  return (
    <div className="profile-container">
      <h2>Welcome, <span>{login.username}</span></h2>

      <div className="stats">
        <div className="stat-box income">
          <h4>Total Income</h4>
          <p>₹ {summary.income.toFixed(2)}</p>
        </div>
        <div className="stat-box expense">
          <h4>Total Expense</h4>
          <p>₹ {summary.expense.toFixed(2)}</p>
        </div>
        <div className="stat-box balance">
          <h4>Remaining Balance</h4>
          <p className={balance>0?'bal-pos':'bal-neg'}>₹ {balance.toFixed(2)}</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  )
}
