import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import { format } from 'date-fns'

const AddTransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
  const [formData, setFormData] = useState({
    farmId: '',
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  const [farms, setFarms] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const expenseCategories = [
    'Seeds & Plants',
    'Fertilizers',
    'Pesticides',
    'Equipment',
    'Fuel',
    'Labor',
    'Maintenance',
    'Utilities',
    'Insurance',
    'Other'
  ]

  const incomeCategories = [
    'Crop Sales',
    'Livestock Sales',
    'Equipment Rental',
    'Consulting',
    'Subsidies',
    'Other'
  ]

  useEffect(() => {
    if (isOpen) {
      loadFarms()
    }
  }, [isOpen])

  useEffect(() => {
    if (transaction) {
      setFormData({
        farmId: transaction.farmId,
        type: transaction.type,
        category: transaction.category,
        amount: Math.abs(transaction.amount).toString(),
        description: transaction.description,
        date: format(new Date(transaction.date), 'yyyy-MM-dd')
      })
    } else {
      setFormData({
        farmId: '',
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      })
    }
    setErrors({})
  }, [transaction, isOpen])

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll()
      setFarms(data)
    } catch (error) {
      console.error('Failed to load farms:', error)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.farmId) newErrors.farmId = 'Farm selection is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required'
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number'
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.date) newErrors.date = 'Date is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const transactionData = {
        ...formData,
        farmId: parseInt(formData.farmId),
        amount: formData.type === 'income' ? parseFloat(formData.amount) : -parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }
      await onSave(transactionData)
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save transaction' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Reset category when type changes
    if (field === 'type') {
      setFormData(prev => ({ ...prev, category: '' }))
      if (errors.category) {
        setErrors(prev => ({ ...prev, category: '' }))
      }
    }
  }

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="farmId">Farm *</Label>
            <select
              id="farmId"
              value={formData.farmId}
              onChange={(e) => handleChange('farmId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a farm</option>
              {farms.map(farm => (
                <option key={farm.Id} value={farm.Id}>{farm.name}</option>
              ))}
            </select>
            {errors.farmId && <p className="text-sm text-error mt-1">{errors.farmId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {currentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-error mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
              {errors.amount && <p className="text-sm text-error mt-1">{errors.amount}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && <p className="text-sm text-error mt-1">{errors.date}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the transaction"
            />
            {errors.description && <p className="text-sm text-error mt-1">{errors.description}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
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
                  {transaction ? 'Update Transaction' : 'Add Transaction'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransactionModal