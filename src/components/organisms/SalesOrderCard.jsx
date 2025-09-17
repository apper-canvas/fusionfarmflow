import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const SalesOrderCard = ({ order, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getAmountColor = (amount) => {
    if (amount >= 10000) return 'text-success'
    if (amount >= 5000) return 'text-info'
    if (amount >= 1000) return 'text-warning'
    return 'text-gray-700'
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {order.Name || 'Untitled Order'}
          </h3>
          <p className="text-gray-600 text-sm">
            Customer: {order.customer_name_c || 'N/A'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="p-2"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-2 text-error hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Order Date:</span>
          <span className="text-sm font-medium">{formatDate(order.order_date_c)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className={`text-lg font-bold ${getAmountColor(order.total_amount_c)}`}>
            {formatCurrency(order.total_amount_c)}
          </span>
        </div>

        {order.Tags && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {order.Tags.split(',').filter(tag => tag.trim()).slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
              {order.Tags.split(',').filter(tag => tag.trim()).length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{order.Tags.split(',').filter(tag => tag.trim()).length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <ApperIcon name="Calendar" size={12} className="mr-1" />
            Created {formatDate(order.CreatedOn)}
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1"
        >
          <ApperIcon name="Edit2" size={14} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-error hover:text-error border-error hover:border-error"
        >
          <ApperIcon name="Trash2" size={14} className="mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  )
}

export default SalesOrderCard