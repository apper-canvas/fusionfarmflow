import React from 'react'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  gradient = false 
}) => {
  return (
    <Card className={`${gradient ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500'
            }`}>
              {trend === 'up' && <ApperIcon name="TrendingUp" size={16} className="mr-1" />}
              {trend === 'down' && <ApperIcon name="TrendingDown" size={16} className="mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard