import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import updateBalance from './updateBalance'
import '../style/PopupCard.css'

export default function EditAction() {
    const [updateDate, setUpdateData] = useState({
        
    })
    const {type, id} = useParams()
    const [oldPrice, setOldPrice] = useState(0)
    const [label, setLabel] = useState('')
    const [category, setCategory] = useState([{"id":0,"name":""}])
    const [newCategory, setNewCategory] = useState({"id":0,"name":""})
    const [add,setAdd] = useState(false)
    const [referse, setReferse] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        setLabel(type==='cash-out'?'category':'source')
    },[type])

    useEffect(()=>{
        axios.get(`http://localhost:4000/${type}/${id}`)
        .then(res=>{
            setUpdateData(res.data);
            setOldPrice(type==='cash-out' ? res.data.price : res.data.amount)
        })
        .catch(err=>console.log(err))
    },[id,type])

    const handleChange=(e)=>{
        const {name,value} = e.target
        setUpdateData(prev=>({...prev,[name]:value}))
    }

    useEffect(()=>{
        axios.get(`http://localhost:4000/${label}`)
        .then(res=>{
            console.log(label + " " + res.data)
            setCategory(Array.isArray(res.data) ? res.data : [res.data]);
        })
        .catch(err=>console.log(err))
    },[label,referse])

    const handleNewCategory=(e)=>{
        e.preventDefault()
        const isValid = newCategory.name.trim().length === 0 || category.some(x => x.name.toLowerCase() === newCategory.name.toLowerCase())
        if(!isValid)
        {
            axios.post(`http://localhost:4000/${label}`,newCategory)
            .then(res=>{
                alert('New Label added successfully')
                setAdd(false);
                setReferse(prev=>!prev)
            })
            .catch(err=>alert(err))
        }
        else if(isValid) alert('Already exists')
        else alert('Enter valid Input')
    }

    const handleSubmit=(e)=>{
        e.preventDefault()  
        let validInput = false;  
        if (type === 'cash-out') {
        validInput = String(updateDate.item).trim() !== "" &&
                 String(updateDate.category).trim() !== "" &&
                 String(updateDate.datetime).trim() !== "" &&
                 parseFloat(updateDate.quantity) > 0 &&
                 parseFloat(updateDate.price) > 0;
        } else {
        validInput = String(updateDate.source).trim() !== "" &&
                 String(updateDate.datetime).trim() !== "" &&
                 parseFloat(updateDate.amount) > 0;
        }
        if(validInput){
            let finalUpdateData;
            if (type === 'cash-out') {finalUpdateData = {...updateDate,price: parseFloat(updateDate.price),quantity: parseFloat(updateDate.quantity)};} 
            else {finalUpdateData = {...updateDate,amount: parseFloat(updateDate.amount)}}
            axios.put(`http://localhost:4000/${type}/${id}`,finalUpdateData)
            .then(
                alert('Updated Successully'),
                type === 'cash-out' ? updateBalance(oldPrice-updateDate.price) : updateBalance(updateDate.amount-oldPrice),
                navigate(-1)
            )
            .catch(err=>alert('submit'+err))
        }
        else{
            alert('Enter Valid Input')
        }
    }

  return (
    <div>
    {type !== 'cash-in' ?
        <div className='container'>
        <button onClick={()=>{navigate('../displaydata/cash-out')}}> X </button>
        <h4 className='title'>Edit Expense</h4>
        <form className='card' onSubmit={handleSubmit}>
            <input className='inp-grp' type='number' name='price' value={updateDate.price} onChange={handleChange} />
            {!add ? 
            <div>
                <select className='sel-opt' name='category' value={updateDate.category} onChange={handleChange}>
                    {category.map(x=>(
                        <option className='options' key={x.id}>{x.name}</option>
                    ))}
                </select>
            <button type='button' onClick={()=>setAdd(true)}> + </button>
            </div> :
            <div className='category'>
                <input className='inp-grp' type='text' placeholder='Add new Category' value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory,name:e.target.value})}/>
                <button className='add-can' type='button' onClick={handleNewCategory}>add</button>
                <button className='add-can' type='button' onClick={()=>setAdd(false)}>Cancel</button>
            </div>}
            <div className='item-qty'>
                <input className='inp-grp' type='text' name='item' value={updateDate.item} onChange={handleChange} placeholder='Item name'/>
                <input className='inp-grp' type='number' name='quantity' value={updateDate.quantity} onChange={handleChange} placeholder='Qty'/>
            </div>
            <input className='inp-grp' type='datetime-local' name='datetime' value={updateDate.datetime} onChange={handleChange} />
            <button className='submit-btn' type='submit'>Update Expense</button>
        </form>
        </div>
        :
        <div className='container'>
        <button onClick={()=>{navigate('../displaydata/cash-in')}}> X </button>
        <h4 className='title'>Edit Income</h4>
        <form className='card' onSubmit={handleSubmit}>
            <input className='inp-grp' type='number' name='amount' value={updateDate.amount} onChange={handleChange} />
            {!add ? 
            <div>
                <select className='sel-opt' name='source' value={updateDate.source} onChange={handleChange}>
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
            <input className='inp-grp' type='datetime-local' name='datetime' value={updateDate.datetime} onChange={handleChange} />
            <button className='submit-btn' type='submit'>Update Income</button>
        </form>
        </div>
    }
    </div>
  )
}
