import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FarmerCard = ({ farmer, onEdit, onDelete }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString()
  
  const getTags = (tags) => {
    if (!tags) return []
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
            <ApperIcon name="User" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{farmer.name_c}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="Phone" size={14} className="mr-1" />
              {farmer.contact_information_c || 'No contact info'}
            </p>
          </div>
        </div>
        {getTags(farmer.Tags).length > 0 && (
          <Badge variant="secondary">
            {getTags(farmer.Tags)[0]}
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Created</span>
          <span className="font-medium">{formatDate(farmer.CreatedOn)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <Badge variant="success">Active</Badge>
        </div>
        {getTags(farmer.Tags).length > 1 && (
          <div className="flex items-start justify-between text-sm">
            <span className="text-gray-600">Tags</span>
            <div className="flex flex-wrap gap-1 max-w-32">
              {getTags(farmer.Tags).slice(1, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {getTags(farmer.Tags).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{getTags(farmer.Tags).length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(farmer)}
          className="flex-1"
        >
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(farmer.Id)}
          className="text-error hover:bg-red-50 hover:text-error"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default FarmerCard