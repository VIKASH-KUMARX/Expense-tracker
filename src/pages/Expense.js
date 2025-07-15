import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../style/Expense.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import DisplayData from '../components/DisplayData';

export default function Expense() {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    axios.get("http://localhost:4000/balance")
    .then(res=>setAmount(res.data.amount))
    .catch(err=>alert(err))
  },[amount])

  const match = location.pathname.match(/\/displaydata\/(cash-in|cash-out)/);
  const currentType = match ? match[1] : null;

  const notValid = location.pathname.match(/addcashin|addexpense|editaction|deleteaction/);
  
  return (
    <div>
      <div className='TopBar'>
        <h1 className='RemAmount'>Balance Amount : {amount}</h1>
        <div className='topbar-btn'>
          <button className='AddCashBtn' onClick={()=>navigate('displaydata/cash-in/addcashin')}> Add Cash In </button>
          <button className='AddExpenseBtn' onClick={()=>navigate('displaydata/cash-out/addexpense')}> Add Expense </button>
        </div>
      </div>
      { notValid && <Outlet/> }
      <div className="toggle-buttons">
        <button className={currentType === 'cash-in' ? 'toggle-btn-in active' : 'toggle-btn-in'} onClick={() => navigate('displaydata/cash-in')}>
          Income Details
        </button>
        <button className={currentType === 'cash-out' ? 'toggle-btn-out active' : 'toggle-btn-out'} onClick={() => navigate('displaydata/cash-out')}>
          Expense Details
        </button>
      </div>
      { currentType && <DisplayData type={currentType}/> }
    </div>
  )
}
