import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'

const AddSalesOrderModal = ({ order, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    Name: '',
    customer_name_c: '',
    order_date_c: '',
    total_amount_c: '',
    Tags: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({
        Name: order.Name || '',
        customer_name_c: order.customer_name_c || '',
        order_date_c: order.order_date_c || '',
        total_amount_c: order.total_amount_c?.toString() || '',
        Tags: order.Tags || ''
      })
    }
  }, [order])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customer_name_c.trim()) {
      newErrors.customer_name_c = 'Customer name is required'
    }

    if (!formData.order_date_c) {
      newErrors.order_date_c = 'Order date is required'
    }

    if (!formData.total_amount_c || isNaN(parseFloat(formData.total_amount_c))) {
      newErrors.total_amount_c = 'Valid total amount is required'
    } else if (parseFloat(formData.total_amount_c) < 0) {
      newErrors.total_amount_c = 'Total amount must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const formatCurrencyInput = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    
    // Ensure only one decimal point
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2)
    }
    
    return numericValue
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {order ? 'Edit Sales Order' : 'Add Sales Order'}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="Name">Order Name</Label>
              <Input
                id="Name"
                type="text"
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                placeholder="Enter order name (optional)"
                className={errors.Name ? 'border-error' : ''}
              />
              {errors.Name && (
                <p className="text-sm text-error mt-1">{errors.Name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customer_name_c">Customer Name *</Label>
              <Input
                id="customer_name_c"
                type="text"
                value={formData.customer_name_c}
                onChange={(e) => handleChange('customer_name_c', e.target.value)}
                placeholder="Enter customer name"
                className={errors.customer_name_c ? 'border-error' : ''}
              />
              {errors.customer_name_c && (
                <p className="text-sm text-error mt-1">{errors.customer_name_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="order_date_c">Order Date *</Label>
              <Input
                id="order_date_c"
                type="date"
                value={formData.order_date_c}
                onChange={(e) => handleChange('order_date_c', e.target.value)}
                className={errors.order_date_c ? 'border-error' : ''}
              />
              {errors.order_date_c && (
                <p className="text-sm text-error mt-1">{errors.order_date_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="total_amount_c">Total Amount * ($)</Label>
              <Input
                id="total_amount_c"
                type="text"
                value={formData.total_amount_c}
                onChange={(e) => handleChange('total_amount_c', formatCurrencyInput(e.target.value))}
                placeholder="0.00"
                className={errors.total_amount_c ? 'border-error' : ''}
              />
              {errors.total_amount_c && (
                <p className="text-sm text-error mt-1">{errors.total_amount_c}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="Tags">Tags</Label>
            <Input
              id="Tags"
              type="text"
              value={formData.Tags}
              onChange={(e) => handleChange('Tags', e.target.value)}
              placeholder="Enter tags separated by commas"
              className={errors.Tags ? 'border-error' : ''}
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple tags with commas (e.g., urgent, bulk-order, wholesale)
            </p>
            {errors.Tags && (
              <p className="text-sm text-error mt-1">{errors.Tags}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {order ? 'Update Order' : 'Create Order'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSalesOrderModal