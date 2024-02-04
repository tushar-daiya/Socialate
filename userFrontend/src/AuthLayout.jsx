import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className='flex h-screen'>
        <div className="w-1/2">
            <Outlet/>
        </div>
        <div className="w-1/2 flex">
            <img src='authbanner.webp' className='w-full'/>
        </div>
    </div>
  )
}

export default AuthLayout