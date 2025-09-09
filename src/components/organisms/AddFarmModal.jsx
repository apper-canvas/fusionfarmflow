import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'

const AddFarmModal = ({ isOpen, onClose, onSave, farm = null }) => {
const [formData, setFormData] = useState({
    name_c: '',
    location_c: '',
    size_c: '',
    unit_c: 'acres'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
if (farm) {
      setFormData({
        name_c: farm.name_c,
        location_c: farm.location_c,
        size_c: farm.size_c.toString(),
        unit_c: farm.unit_c
      })
    } else {
      setFormData({
name_c: '',
        location_c: '',
        size_c: '',
        unit_c: 'acres'
      })
    }
    setErrors({})
  }, [farm, isOpen])

  const validate = () => {
    const newErrors = {}
if (!formData.name_c.trim()) newErrors.name = 'Farm name is required'
    if (!formData.location_c.trim()) newErrors.location = 'Location is required'
    if (!formData.size_c.trim()) newErrors.size = 'Size is required'
    if (isNaN(formData.size_c) || parseFloat(formData.size_c) <= 0) {
      newErrors.size = 'Size must be a valid positive number'
    }
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
      const farmData = {
...formData,
        size_c: parseFloat(formData.size_c)
      }
      await onSave(farmData)
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save farm' })
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
              {farm ? 'Edit Farm' : 'Add New Farm'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
value={formData.name_c}
              onChange={(e) => handleChange('name_c', e.target.value)}
              placeholder="Enter farm name"
            />
            {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
value={formData.location_c}
              onChange={(e) => handleChange('location_c', e.target.value)}
              placeholder="Enter location"
            />
            {errors.location && <p className="text-sm text-error mt-1">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size">Size *</Label>
              <Input
                id="size"
                type="number"
                step="0.1"
value={formData.size_c}
                onChange={(e) => handleChange('size_c', e.target.value)}
                placeholder="0.0"
              />
              {errors.size && <p className="text-sm text-error mt-1">{errors.size}</p>}
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
value={formData.unit_c}
                onChange={(e) => handleChange('unit_c', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>
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
                  {farm ? 'Update Farm' : 'Add Farm'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFarmModal