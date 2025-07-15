import React from 'react'
import '../style/Mainpage.css'
import { NavLink, Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div className='MainPage'>
        <nav className='SideBar'>
            <h1>EXPE</h1>
            <NavLink to='home'> HOME </NavLink>
            <NavLink to='/main/expense'> EXPENSE </NavLink>
            <NavLink to='analyze'> ANALYZE </NavLink>
            <NavLink to='support'> SUPPORT </NavLink>
            <NavLink to='profile'> PROFILE </NavLink>
        </nav>
        <div className='MainBar'>
            <Outlet/>
        </div>
    </div>
  )
}
