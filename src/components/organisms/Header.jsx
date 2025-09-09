import React, { useContext } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '../../App'

const LogoutButton = () => {
  const { logout } = useContext(AuthContext)
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={logout}
      className="hidden md:flex"
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  )
}
const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600">Welcome back!</p>
            <p className="text-lg font-semibold text-gray-900">Manage your farm operations</p>
          </div>
        </div>
<div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <ApperIcon name="Bell" size={16} className="mr-2" />
            Notifications
          </Button>
          <LogoutButton />
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header