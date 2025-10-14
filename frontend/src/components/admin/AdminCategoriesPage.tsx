import React from 'react'
import { AdminCategoriesManager } from './AdminCategoriesManager'
import './AdminCategoriesManager.css'

/**
 * Example usage of Admin Categories Manager
 * 
 * This component demonstrates how to integrate the admin categories manager
 * into your admin panel or dashboard.
 */
export const AdminCategoriesPage: React.FC = () => {
  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="breadcrumb">
          <span>Admin</span>
          <span>/</span>
          <span>Categories</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <AdminCategoriesManager />
      </div>
    </div>
  )
}

/**
 * Alternative: Minimal integration example
 */
export const AdminCategoriesWidget: React.FC = () => {
  return (
    <div className="dashboard-widget">
      <AdminCategoriesManager />
    </div>
  )
}

/**
 * Alternative: With custom wrapper and additional features
 */
export const AdminCategoriesWithSidebar: React.FC = () => {
  return (
    <div className="admin-layout">
      <div className="sidebar">
        <nav>
          <ul>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/providers">Providers</a></li>
            <li className="active"><a href="/admin/categories">Categories</a></li>
            <li><a href="/admin/services">Services</a></li>
            <li><a href="/admin/bookings">Bookings</a></li>
          </ul>
        </nav>
      </div>
      
      <div className="main-content">
        <AdminCategoriesManager />
      </div>
    </div>
  )
}

export default AdminCategoriesPage