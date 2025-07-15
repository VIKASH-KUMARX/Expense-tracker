import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../components/Auth'
import '../style/Login.css'

export default function Signup() {
    const [userData, setUserData] = useState({
        "username":"",
        "email":"",
        "password":""
    })
    const [ConfirmPassword, setConfirmPassword] = useState('')
    const { setLogin } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange=(e)=>{
        const {name, value} = e.target
        setUserData(prev=>({...prev,[name]:value}))
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        if(userData.password===ConfirmPassword)
        {
            axios.post("http://localhost:4000/login",userData)
            .then(()=>{
              setLogin({ username:userData.username, status:true });
              navigate(-1)
            })
            .catch(err=>alert('err in submit'+err))
        }
        else{
            alert('Password Mismatch')
        }
    }

  return (
    <div class="login-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input className='username-input' type="text" name='username' value={userData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name='email' value={userData.email} onChange={handleChange} placeholder="Email ID" required />
        <input type="password" name='password' value={userData.password} onChange={handleChange} placeholder="Password" required />
        <input type="password" onChange={e=>(setConfirmPassword(e.target.value))} placeholder="Confirm Password" required />
        <button type="submit" className='login-btn'>Create Account</button>
      </form>
      <div class="create-account">
        Already have an account?
        <button className='link-btn' onClick={()=>navigate(-1)}>Login</button>
      </div>
    </div>
  )
}
