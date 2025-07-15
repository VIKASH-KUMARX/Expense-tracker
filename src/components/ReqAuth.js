import React, { useContext } from 'react'
import { AuthContext } from './Auth'
import { Navigate } from 'react-router-dom'

export default function ReqAuth({children}) {
    const {login} = useContext(AuthContext)
    console.log(login)
    if(!login.status){
        return <Navigate to='/' />
    }
    return children;
}
