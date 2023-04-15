import React from 'react'
import UserSideNav from '../../components/UserSideNav'
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className='bg-neutral-100 py-12 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          {/* // <UserSideNav /> */}
          <div className='md:col-span-3 lg:col-span-2'>
            <UserSideNav />
          </div>

          {/* <Outlet /> */}
          <div className='md:col-span-9 lg:col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
