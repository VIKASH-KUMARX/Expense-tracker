import axios from 'axios'
import React, { useEffect, useState } from 'react'
import updateBalance from './updateBalance'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function DeleteAction() {
    const { type, id } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    useEffect(()=>{
        axios.delete(`http://localhost:4000/${type}/${id}`)
        .then(
            alert('Deleted Successfully'),
            updateBalance(type==='cash-out' ? state.price : -state.amount),
            navigate(-1)
        )
        .catch(err=>console.log(err))
    })
  return (
    <div>

    </div>
  )
}
