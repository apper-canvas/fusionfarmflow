import React from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add New", 
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl border border-accent-100">
      <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty