import React, { useEffect } from 'react'
import AdminSidebar from '../components/common/Sidebars/AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchLeads } from '../redux/features/leads/leadsSlice'
import useRefetchOnFocus from '../utils/useRefetchOnFocus'

export default function AdminLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  // Pick up changes other roles made while this tab was in the background.
  useRefetchOnFocus(() => dispatch(fetchLeads()));
  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 min-w-0 overflow-x-hidden px-4 py-5 pt-16 lg:p-6 lg:pt-14 lg:ml-52 bg-gray-50 min-h-screen'>
        <Outlet />
      </div>
    </div>
  )
}
