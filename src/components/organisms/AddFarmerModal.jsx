import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'

const AddFarmerModal = ({ isOpen, onClose, onSave, farmer = null }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    contact_information_c: '',
    Tags: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (farmer) {
      setFormData({
        name_c: farmer.name_c || '',
        contact_information_c: farmer.contact_information_c || '',
        Tags: farmer.Tags || ''
      })
    } else {
      setFormData({
        name_c: '',
        contact_information_c: '',
        Tags: ''
      })
    }
    setErrors({})
  }, [farmer, isOpen])

  const validate = () => {
    const newErrors = {}
    if (!formData.name_c.trim()) newErrors.name = 'Farmer name is required'
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
      await onSave(formData)
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save farmer' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {farmer ? 'Edit Farmer' : 'Add New Farmer'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Farmer Name *</Label>
            <Input
              id="name"
              value={formData.name_c}
              onChange={(e) => handleChange('name_c', e.target.value)}
              placeholder="Enter farmer name"
            />
            {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="contact">Contact Information</Label>
            <Input
              id="contact"
              value={formData.contact_information_c}
              onChange={(e) => handleChange('contact_information_c', e.target.value)}
              placeholder="Enter contact information"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.Tags}
              onChange={(e) => handleChange('Tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
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
                  {farmer ? 'Update Farmer' : 'Add Farmer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFarmerModal