import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../components/Auth'
import '../style/Login.css'

export default function Login() {
    const [formData, setFormData] = useState({
        "email":"",
        "password":""
    })
    const [userDatas, setUserDatas] = useState([])
    const { setLogin }= useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get("http://localhost:4000/login")
        .then(res=>setUserDatas(res.data))
        .catch(err=>console.log("err in user fetch"+err))
    },[])

    const handleChange=(e)=>{
        const {name, value} = e.target
        setFormData(prev=>({...prev,[name]:value}))
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        const found = userDatas.find(x=>x.email===formData.email && x.password===formData.password)
        if(found){
            setLogin({ username:found.username, status:true })
            navigate('main/home')
        }
        else{
            alert('Enter valid Input')
        }
    }

  return (
    <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input type="email" name='email' value={formData.email} onChange={handleChange} placeholder="Email ID" required />
            <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit" className='login-btn'>Login</button>
        </form>
        <div class="create-account">
            Don't have an account?
            <button className='link-btn' onClick={()=>navigate('signup')}>Create Account</button>
        </div>
    </div>
  )
}
