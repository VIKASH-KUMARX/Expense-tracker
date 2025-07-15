import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../style/PopupCard.css'
import updateBalance from './updateBalance'

export default function AddCashIn() {
    const [caseIn, setCashIn] = useState({
        "amount":"",
        "source":"",
        "datetime":""
    })
    const [source, setSource] = useState([{"name":""}])
    const [newSource, setNewSource] = useState({"name":""})
    const [add, setAdd] = useState(false)
    const [referse, setReferse] = useState(false)
    const navigate = useNavigate()

    const handleChange=(e)=>{
        const {name,value} = e.target
        setCashIn(prev=>({...prev,[name]:value}))
    }

    useEffect(()=>{
        axios.get("http://localhost:4000/source")
        .then(res=>setSource(res.data))
    },[referse])

    const handleNewSource=(e)=>{
        e.preventDefault()
        const isValid = newSource.name.trim().length ===0 || source.some(x => x.name.toLowerCase() === newSource.name.toLowerCase())
        if(!isValid)
        {
            axios.post("http://localhost:4000/source",newSource)
            .then(res=>{
                alert('New Source added successfully')
                setAdd(false);
                setReferse(prev=>!prev)
                setNewSource('')
            })
            .catch(err=>alert(err))
        }
        else if(newSource.name.trim().length ===0) alert('Enter Valid Source')
        else if(isValid) alert('Source already exists')
        else alert('Enter valid Source')
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        const validInput = String(caseIn.source).trim()!=="" && 
                        String(caseIn.datetime).trim()!=="" &&
                        parseFloat(caseIn.amount)>0;
        
        if(validInput){
            const cashInData = {...caseIn,amount:parseFloat(caseIn.amount)}
            axios.post('http://localhost:4000/cash-in',cashInData)
            .then(res=>{
                alert('Cash Added Successully');
                setCashIn({
                    "amount":"",
                    "source":"",
                    "datetime":""
                });
                updateBalance(cashInData.amount)
            })
            .catch(err=>alert(err))
        }
        else{
            alert('Enter Valid Input')
        }
    }

  return (
    <div className='container'>
        <button onClick={()=>{navigate('../displaydata/cash-in')}}> X </button>
        <h4 className='title'>Add Cash In</h4>
        <form className='card' onSubmit={handleSubmit}>
            <input className='inp-grp' type='number' name='amount' value={caseIn.amount} onChange={handleChange} placeholder='Total Amount'/>
            {!add ? 
            <div>
                <select className='sel-opt' name='source' value={caseIn.source} onChange={handleChange}>
                    <option> Select Category </option>
                    {source.map(x=>(
                        <option className='options' key={x.id}>{x.name}</option>
                    ))}
                </select>
            <button type='button' onClick={()=>setAdd(true)}> + </button>
            </div> :
            <div className='category'>
                <input className='inp-grp' type='text' placeholder='Add new Source' value={newSource.name} onChange={(e)=>setNewSource({...newSource,name:e.target.value})}/>
                <div className='category-btn'>
                    <button className='add-can' type='button' onClick={handleNewSource}>add</button>
                    <button className='add-can' type='button' onClick={()=>setAdd(false)}>Cancel</button>
                </div>
            </div>}
            <input className='inp-grp' type='datetime-local' name='datetime' value={caseIn.datetime} onChange={handleChange} />
            <button className='submit-btn' type='submit'>Add Income</button>
        </form>
    </div>
  )
}
