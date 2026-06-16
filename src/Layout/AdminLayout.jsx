import React from 'react'
import AdminSidebar from '../components/common/Sidebars/AdminSidebar'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 min-w-0 overflow-x-hidden px-4 py-5 pt-16 lg:p-6 lg:pt-14 lg:ml-52 bg-gray-50 min-h-screen'>
        <Outlet />
      </div>
    </div>
  )
}
