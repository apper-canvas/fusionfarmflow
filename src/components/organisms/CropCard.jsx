import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const CropCard = ({ crop, farmName, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'planted': return 'info'
      case 'growing': return 'success'
      case 'ready': return 'warning'
      case 'harvested': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'planted': return 'Sprout'
      case 'growing': return 'TreePine'
      case 'ready': return 'Star'
      case 'harvested': return 'Package'
      default: return 'Sprout'
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-lg">
            <ApperIcon name={getStatusIcon(crop.status)} size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
            <p className="text-sm text-gray-600">{crop.variety}</p>
            <p className="text-xs text-gray-500">{farmName}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(crop.status)}>{crop.status}</Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block">Planted</span>
            <span className="font-medium">{format(new Date(crop.plantedDate), 'MMM dd, yyyy')}</span>
          </div>
          <div>
            <span className="text-gray-600 block">Expected Harvest</span>
            <span className="font-medium">{format(new Date(crop.expectedHarvest), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-gray-600 block">Area</span>
          <span className="font-medium">{crop.area} acres</span>
        </div>
        {crop.notes && (
          <div className="text-sm">
            <span className="text-gray-600 block">Notes</span>
            <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded">{crop.notes}</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(crop)}
          className="flex-1"
        >
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(crop.Id)}
          className="text-error hover:bg-red-50 hover:text-error"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default CropCard