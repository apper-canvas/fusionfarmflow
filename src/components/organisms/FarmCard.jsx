import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FarmCard = ({ farm, onEdit, onDelete }) => {
  const formatSize = (size, unit) => `${size} ${unit}`
  const formatDate = (date) => new Date(date).toLocaleDateString()

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
            <ApperIcon name="MapPin" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="Map" size={14} className="mr-1" />
              {farm.location}
            </p>
          </div>
        </div>
        <Badge variant="primary">{formatSize(farm.size, farm.unit)}</Badge>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Created</span>
          <span className="font-medium">{formatDate(farm.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <Badge variant="success">Active</Badge>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(farm)}
          className="flex-1"
        >
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(farm.Id)}
          className="text-error hover:bg-red-50 hover:text-error"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default FarmCard