import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Expense from './pages/Expense';
import Analyze from './pages/Analyze';
import Support from './pages/Support';
import AddCashIn from './components/AddCashIn';
import PageNotFound from './components/PageNotFound';
import AddExpense from './components/AddExpense';
import EditAction from './components/EditAction';
import DeleteAction from './components/DeleteAction';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React, { useState } from 'react';
import Auth from './components/Auth';
import ReqAuth from './components/ReqAuth';
import Profile from './pages/Profile';
import DisplayData from './components/DisplayData';
import Home from './pages/Home';
import FilterByDates from './components/FilterByDates';
import Filter from './components/Filters';

export const AuthContext = React.createContext()

function App() {
  return (
    <Auth>
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/main' element={<ReqAuth><Main/></ReqAuth>}>
          <Route index element={<ReqAuth><Home/></ReqAuth>}/>
          <Route path='home' element={<ReqAuth><Home/></ReqAuth>}/>
          <Route path='expense' element={<ReqAuth><Expense/></ReqAuth>}>
              <Route index element={<AddExpense/>}/>
              <Route path='displaydata/:type' element={<ReqAuth><></></ReqAuth>}/>
              <Route path='displaydata/:type/editaction/:id' element={<ReqAuth><EditAction/></ReqAuth>}/>
              <Route path='displaydata/:type/deleteaction/:id' element={<ReqAuth><DeleteAction/></ReqAuth>}/>
              <Route path='displaydata/cash-in/addcashin' element={<ReqAuth><AddCashIn/></ReqAuth>}/>
              <Route path='displaydata/cash-out/addexpense' element={<ReqAuth><AddExpense/></ReqAuth>}/>
          </Route>
          <Route path='analyze' element={<ReqAuth><Analyze/></ReqAuth>}>
            <Route path='filterbydates' element={<ReqAuth><FilterByDates/></ReqAuth>}/>
            <Route path='filters' element={<ReqAuth><Filter/></ReqAuth>}/>
          </Route>
          <Route path='support' element={<ReqAuth><Support/></ReqAuth>}/>
          <Route path='profile' element={<ReqAuth><Profile/></ReqAuth>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </div>
    </Auth>
  );
}

export default App;
