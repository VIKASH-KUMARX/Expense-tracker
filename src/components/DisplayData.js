import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

export default function DisplayData({type}) {
    const [data,setData] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
    axios.get(`http://localhost:4000/${type}`)
    .then(res=>setData(res.data))
    .catch(err=>alert("err in fetch"+err))
    },[data])

  return (
    <div>
      {type!=='cash-in' ?
      (data.length!==0 ? 
        <table className='DisplayTable'>
        <thead>
          <tr>
            <th>NAME</th>
            <th>CATEGORY</th>
            <th>QUANTITY</th>
            <th>PRICE</th>
            <th>DATE-TIME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x)=>(
            <tr key={x.id}>
              <td>{x.item}</td>
              <td>{x.category}</td>
              <td>{x.quantity}</td>
              <td>{x.price}</td>
              <td>{x.datetime}</td>
              <td>
                <button className='edit-btn' onClick={()=>{navigate(`displaydata/${type}/editaction/${x.id}`)}}>Edit</button>
                <button className='del-btn' onClick={()=>{navigate(`displaydata/${type}/deleteaction/${x.id}`, 
                  {state:{price:x.price}}
                  )}
                }>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> : <h1 className='no-data'>No Expense Added</h1>)
      
      :

      (data.length!==0 ?
      <table className='DisplayTable'>
        <thead>
          <tr>
            <th>AMOUNT</th>
            <th>SOURCE</th>
            <th>DATE-TIME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x)=>(
            <tr key={x.id}>
              <td>{x.amount}</td>
              <td>{x.source}</td>
              <td>{x.datetime}</td>
              <td>
                <button className='edit-btn' onClick={()=>{navigate(`displaydata/${type}/editaction/${x.id}`)}}>Edit</button>
                <button className='del-btn' onClick={()=>{navigate(`displaydata/${type}/deleteaction/${x.id}`, 
                  {state:{amount:x.amount}}
                  )}
                }>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> : <h1 className='no-data'>No Income Added</h1>)}
    </div>
  )
}
