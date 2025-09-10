import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format, isAfter, parseISO } from 'date-fns'

const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational': return 'success'
      case 'maintenance': return 'warning'
      case 'repair': return 'error'
      case 'retired': return 'default'
      default: return 'info'
    }
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'tractor':
      case 'compact tractor':
        return 'Tractor'
      case 'utility vehicle':
        return 'Car'
      case 'implement':
        return 'Wrench'
      case 'hay equipment':
      case 'planter':
        return 'Package'
      default:
        return 'Settings'
    }
  }

  const isMaintenanceOverdue = (nextMaintenance) => {
    if (!nextMaintenance || nextMaintenance === 'N/A') return false
    try {
      return isAfter(new Date(), parseISO(nextMaintenance))
    } catch {
      return false
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const maintenanceOverdue = isMaintenanceOverdue(equipment.nextMaintenance)

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg">
            <ApperIcon name={getTypeIcon(equipment.type)} size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
            <p className="text-sm text-gray-600">{equipment.brand} {equipment.model}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(equipment)}>
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(equipment.Id)}>
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Type:</span>
          <Badge variant="outline">{equipment.type}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={getStatusColor(equipment.status)}>{equipment.status}</Badge>
        </div>

        {equipment.hoursUsed !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hours Used:</span>
            <span className="text-sm font-medium">{equipment.hoursUsed.toLocaleString()}</span>
          </div>
        )}

        {equipment.purchasePrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Purchase Price:</span>
            <span className="text-sm font-medium">{formatCurrency(equipment.purchasePrice)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Location:</span>
          <span className="text-sm font-medium">{equipment.location}</span>
        </div>
      </div>

      {equipment.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
      )}

      <div className="border-t pt-3 space-y-2">
        {equipment.lastMaintenance && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Last Maintenance:</span>
            <span>{format(parseISO(equipment.lastMaintenance), 'MMM dd, yyyy')}</span>
          </div>
        )}
        
        {equipment.nextMaintenance && equipment.nextMaintenance !== 'N/A' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Next Maintenance:</span>
            <span className={maintenanceOverdue ? 'text-error font-medium' : ''}>
              {format(parseISO(equipment.nextMaintenance), 'MMM dd, yyyy')}
              {maintenanceOverdue && ' (Overdue)'}
            </span>
          </div>
        )}

        {equipment.purchaseDate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Purchase Date:</span>
            <span>{format(parseISO(equipment.purchaseDate), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EquipmentCard