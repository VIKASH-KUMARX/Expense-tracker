import React, { useEffect, useState } from 'react'
import '../style/PopupCard.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import updateBalance from './updateBalance'

export default function AddExpense() {
    const [expense, setExpense] = useState({
        "item":"",
        "category":"",
        "quantity":"",
        "price":"",
        "datetime":""
    })
    const [category, setCategory] = useState([{"id":0,"name":""}])
    const [newCategory, setNewCategory] = useState({"id":0,"name":""})
    const [add,setAdd] = useState(false)
    const [referse, setReferse] = useState(false)
    const navigate = useNavigate()

    const handleChange=(e)=>{
        const {name,value} = e.target
        setExpense(prev=>({...prev,[name]:value}))
    }

    useEffect(()=>{
        axios.get("http://localhost:4000/category")
        .then(res=>setCategory(res.data))
    },[referse])

    const handleNewCategory=(e)=>{
        e.preventDefault()
        const isValid = newCategory.name.trim().length === 0 || category.some(x => x.name.toLowerCase() === newCategory.name.toLowerCase())
        if(!isValid)
        {
            axios.post("http://localhost:4000/category",newCategory)
            .then(res=>{
                alert('Category added successfully')
                setAdd(false);
                setReferse(prev=>!prev)
            })
            .catch(err=>alert(err))
        }
        else if(newCategory.name.trim().length === 0) alert('Enter Valid Category')
        else if(isValid) alert('Category already exists')
        else alert('Enter valid Category')
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        const validInput = String(expense.item).trim()!=="" &&
                        String(expense.category).trim()!=="" && 
                        String(expense.datetime).trim()!=="" &&
                        parseFloat(expense.quantity)>0 &&
                        parseFloat(expense.price)>0;
        
        if(validInput){
            const expenseData = {...expense,price:parseFloat(expense.price),quantity:parseFloat(expense.quantity)}
            axios.post('http://localhost:4000/cash-out',expenseData)
            .then(
                alert('Expense Added Successully'),
                setExpense({
                    "item":"",
                    "category":"",
                    "quantity":"",
                    "price":"",
                    "datetime":""
                }),
                updateBalance(-expenseData.price),
            )
            .catch(err=>alert(err))
        }
        else{
            alert('Enter Valid Input')
        }
    }

  return (
    <div className='container'>
        <button onClick={()=>{navigate('../displaydata/cash-out')}}> X </button>
        <h4 className='title'>Add Expense</h4>
        <form className='card' onSubmit={handleSubmit}>
            <input className='inp-grp' type='number' name='price' value={expense.price} onChange={handleChange} placeholder='Total Amount'/>
            {!add ? 
            <div>
                <select className='sel-opt' name='category' value={expense.category} onChange={handleChange}>
                    <option> Select Category </option>
                    {category.map(x=>(
                        <option className='options' key={x.id}>{x.name}</option>
                    ))}
                </select>
            <button type='button' onClick={()=>setAdd(true)}> + </button>
            </div> :
            <div className='category'>
                <input className='inp-grp' type='text' placeholder='Add new Category' value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory,name:e.target.value})}/>
                <div className='category-btn'>
                    <button className='add-can' type='button' onClick={handleNewCategory}>add</button>
                    <button className='add-can' type='button' onClick={()=>setAdd(false)}>Cancel</button>
                </div>
            </div>}
            <div className='item-qty'>
                <input className='inp-grp' type='text' name='item' value={expense.item} onChange={handleChange} placeholder='Item name'/>
                <input className='inp-grp' type='number' name='quantity' value={expense.quantity} onChange={handleChange} placeholder='Qty'/>
            </div>
            <input className='inp-grp' type='datetime-local' name='datetime' value={expense.datetime} onChange={handleChange} onKeyDown={(e)=>{if(e.key==='Enter'){ handleChange(e) }}} />
            <button className='submit-btn' type='submit'>Add Expense</button>
        </form>
    </div>
  )
}
