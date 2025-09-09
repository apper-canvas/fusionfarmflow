import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import { format } from 'date-fns'

const AddCropModal = ({ isOpen, onClose, onSave, crop = null }) => {
  const [formData, setFormData] = useState({
farm_id_c: '',
    name_c: '',
    variety_c: '',
    planted_date_c: '',
    expected_harvest_c: '',
    status_c: 'planted',
    area_c: '',
    notes_c: ''
  })
  const [farms, setFarms] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadFarms()
    }
  }, [isOpen])

  useEffect(() => {
if (crop) {
      setFormData({
        farm_id_c: crop.farm_id_c,
        name_c: crop.name_c,
        variety_c: crop.variety_c,
        planted_date_c: format(new Date(crop.planted_date_c), 'yyyy-MM-dd'),
        expected_harvest_c: format(new Date(crop.expected_harvest_c), 'yyyy-MM-dd'),
        status_c: crop.status_c,
        area_c: crop.area_c.toString(),
        notes_c: crop.notes_c || ''
      })
    } else {
      setFormData({
        farmId: '',
        name: '',
        variety: '',
        plantedDate: '',
        expectedHarvest: '',
        status: 'planted',
        area: '',
        notes: ''
      })
    }
    setErrors({})
  }, [crop, isOpen])

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
    if (!formData.name.trim()) newErrors.name = 'Crop name is required'
    if (!formData.variety.trim()) newErrors.variety = 'Variety is required'
    if (!formData.plantedDate) newErrors.plantedDate = 'Planted date is required'
    if (!formData.expectedHarvest) newErrors.expectedHarvest = 'Expected harvest date is required'
    if (!formData.area.trim()) newErrors.area = 'Area is required'
    if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      newErrors.area = 'Area must be a valid positive number'
    }
    if (new Date(formData.expectedHarvest) <= new Date(formData.plantedDate)) {
      newErrors.expectedHarvest = 'Expected harvest must be after planted date'
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
      const cropData = {
...formData,
        area_c: parseFloat(formData.area_c),
        planted_date_c: formData.planted_date_c,
        expected_harvest_c: formData.expected_harvest_c
      }
      await onSave(cropData)
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save crop' })
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {crop ? 'Edit Crop' : 'Add New Crop'}
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
                <option key={farm.Id} value={farm.Id}>{farm.name_c}</option>
              ))}
            </select>
            {errors.farmId && <p className="text-sm text-error mt-1">{errors.farmId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Crop Name *</Label>
              <Input
                id="name"
                value={formData.name}
onChange={(e) => handleChange('name_c', e.target.value)}
                placeholder="e.g., Corn, Wheat, Tomato"
              />
              {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="variety">Variety *</Label>
              <Input
                id="variety"
                value={formData.variety}
                onChange={(e) => handleChange('variety', e.target.value)}
                placeholder="e.g., Sweet Corn, Winter Wheat"
              />
              {errors.variety && <p className="text-sm text-error mt-1">{errors.variety}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantedDate">Planted Date *</Label>
              <Input
                id="plantedDate"
                type="date"
                value={formData.plantedDate}
onChange={(e) => handleChange('planted_date_c', e.target.value)}
              />
              {errors.plantedDate && <p className="text-sm text-error mt-1">{errors.plantedDate}</p>}
            </div>
            <div>
              <Label htmlFor="expectedHarvest">Expected Harvest *</Label>
              <Input
                id="expectedHarvest"
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => handleChange('expectedHarvest', e.target.value)}
              />
              {errors.expectedHarvest && <p className="text-sm text-error mt-1">{errors.expectedHarvest}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
onChange={(e) => handleChange('status_c', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            <div>
              <Label htmlFor="area">Area (acres) *</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
value={formData.area_c}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="0.0"
              />
              {errors.area && <p className="text-sm text-error mt-1">{errors.area}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
onChange={(e) => handleChange('notes_c', e.target.value)}
              placeholder="Additional notes about this crop..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
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
                  {crop ? 'Update Crop' : 'Add Crop'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCropModal