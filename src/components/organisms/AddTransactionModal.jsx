import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import { format } from 'date-fns'

const AddTransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
  const [formData, setFormData] = useState({
farm_id_c: '',
    type_c: 'expense',
    category_c: '',
    amount_c: '',
    description_c: '',
    date_c: format(new Date(), 'yyyy-MM-dd')
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
farm_id_c: transaction.farm_id_c,
        type_c: transaction.type_c,
        category_c: transaction.category_c,
        amount_c: Math.abs(transaction.amount_c).toString(),
        description_c: transaction.description_c,
        date_c: transaction.date_c ? format(new Date(transaction.date_c), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      })
    } else {
setFormData({
        farm_id_c: '',
        type_c: 'expense',
        category_c: '',
        amount_c: '',
        description_c: '',
        date_c: format(new Date(), 'yyyy-MM-dd')
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
if (!formData.farm_id_c) newErrors.farm_id_c = 'Farm selection is required'
    if (!formData.category_c) newErrors.category_c = 'Category is required'
    if (!formData.amount_c.trim()) newErrors.amount_c = 'Amount is required'
    if (isNaN(formData.amount_c) || parseFloat(formData.amount_c) <= 0) {
      newErrors.amount_c = 'Amount must be a valid positive number'
    }
    if (!formData.description_c.trim()) newErrors.description_c = 'Description is required'
    if (!formData.date_c) newErrors.date_c = 'Date is required'
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
        farm_id_c: parseInt(formData.farm_id_c),
        amount_c: formData.type_c === 'income' ? parseFloat(formData.amount_c) : -parseFloat(formData.amount_c),
        date_c: formData.date_c
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
    if (field === 'type_c') {
      setFormData(prev => ({ ...prev, category_c: '' }))
      if (errors.category) {
        setErrors(prev => ({ ...prev, category: '' }))
      }
    }
  }

const currentCategories = formData.type_c === 'income' ? incomeCategories : expenseCategories

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
value={formData.farm_id_c}
              onChange={(e) => handleChange('farm_id_c', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a farm</option>
{farms.map(farm => (
                <option key={farm.Id} value={farm.Id}>{farm.name_c}</option>
              ))}
            </select>
{errors.farm_id_c && <p className="text-sm text-error mt-1">{errors.farm_id_c}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <select
                id="type"
value={formData.type_c}
                onChange={(e) => handleChange('type_c', e.target.value)}
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
value={formData.category_c}
                onChange={(e) => handleChange('category_c', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {currentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
{errors.category_c && <p className="text-sm text-error mt-1">{errors.category_c}</p>}
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
value={formData.amount_c}
                  onChange={(e) => handleChange('amount_c', e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
{errors.amount_c && <p className="text-sm text-error mt-1">{errors.amount_c}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
value={formData.date_c}
                onChange={(e) => handleChange('date_c', e.target.value)}
              />
{errors.date_c && <p className="text-sm text-error mt-1">{errors.date_c}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
value={formData.description_c}
              onChange={(e) => handleChange('description_c', e.target.value)}
              placeholder="Brief description of the transaction"
            />
{errors.description_c && <p className="text-sm text-error mt-1">{errors.description_c}</p>}
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