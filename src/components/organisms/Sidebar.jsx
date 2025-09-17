import React from 'react'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
const navItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/farms', label: 'Farms', icon: 'MapPin' },
    { path: '/crops', label: 'Crops', icon: 'Sprout' },
    { path: '/tasks', label: 'Tasks', icon: 'CheckSquare' },
    { path: '/equipments', label: 'Equipments', icon: 'Wrench' },
    { path: '/finances', label: 'Finances', icon: 'DollarSign' },
    { path: '/sales-orders', label: 'Sales Orders', icon: 'ShoppingCart' },
    { path: '/weather', label: 'Weather', icon: 'Cloud' }
  ]

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
      <div className="p-6 border-b border-primary-600">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg">
            <ApperIcon name="Sprout" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FarmFlow</h1>
            <p className="text-primary-200 text-sm">Agriculture Management</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )

  // Mobile sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary-700 to-primary-800 text-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-primary-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg">
                <ApperIcon name="Sprout" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FarmFlow</h1>
                <p className="text-primary-200 text-sm">Agriculture Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-600 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                    : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                }`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar