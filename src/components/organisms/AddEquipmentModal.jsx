import React, { useState } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'

const AddEquipmentModal = ({ isOpen, onClose, onAdd, equipment }) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: equipment?.type || 'Tractor',
    brand: equipment?.brand || '',
    model: equipment?.model || '',
    description: equipment?.description || '',
    purchaseDate: equipment?.purchaseDate || '',
    purchasePrice: equipment?.purchasePrice || '',
    status: equipment?.status || 'Operational',
    fuelType: equipment?.fuelType || 'Diesel',
    location: equipment?.location || '',
    hoursUsed: equipment?.hoursUsed || 0,
    lastMaintenance: equipment?.lastMaintenance || '',
    nextMaintenance: equipment?.nextMaintenance || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const equipmentTypes = [
    'Tractor',
    'Compact Tractor',
    'Utility Vehicle', 
    'Implement',
    'Hay Equipment',
    'Planter',
    'Harvester',
    'Sprayer',
    'Other'
  ]

  const statusOptions = [
    'Operational',
    'Maintenance',
    'Repair',
    'Retired'
  ]

  const fuelTypes = [
    'Diesel',
    'Gasoline',
    'Electric',
    'N/A'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required'
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.purchasePrice && isNaN(parseFloat(formData.purchasePrice))) {
      newErrors.purchasePrice = 'Please enter a valid price'
    }

    if (formData.hoursUsed && isNaN(parseInt(formData.hoursUsed))) {
      newErrors.hoursUsed = 'Please enter valid hours'
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
      const equipmentData = {
        ...formData,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        hoursUsed: parseInt(formData.hoursUsed) || 0
      }
      
      await onAdd(equipmentData)
      handleClose()
    } catch (error) {
      console.error('Error adding equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'Tractor',
      brand: '',
      model: '',
      description: '',
      purchaseDate: '',
      purchasePrice: '',
      status: 'Operational',
      fuelType: 'Diesel',
      location: '',
      hoursUsed: 0,
      lastMaintenance: '',
      nextMaintenance: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg">
              <ApperIcon name="Wrench" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {equipment ? 'Edit Equipment' : 'Add New Equipment'}
              </h2>
              <p className="text-gray-600 text-sm">
                {equipment ? 'Update equipment information' : 'Add equipment to your inventory'}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Equipment Name" error={errors.name} required>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter equipment name"
              />
            </FormField>

            <FormField label="Type" required>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Brand" error={errors.brand} required>
              <Input
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Enter brand name"
              />
            </FormField>

            <FormField label="Model" error={errors.model} required>
              <Input
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter model"
              />
            </FormField>

            <FormField label="Status" required>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Location" error={errors.location} required>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter storage location"
              />
            </FormField>

            <FormField label="Purchase Date">
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              />
            </FormField>

            <FormField label="Purchase Price ($)" error={errors.purchasePrice}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                placeholder="Enter purchase price"
              />
            </FormField>

            <FormField label="Hours Used" error={errors.hoursUsed}>
              <Input
                type="number"
                min="0"
                value={formData.hoursUsed}
                onChange={(e) => handleInputChange('hoursUsed', e.target.value)}
                placeholder="Enter hours used"
              />
            </FormField>

            <FormField label="Fuel Type">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.fuelType}
                onChange={(e) => handleInputChange('fuelType', e.target.value)}
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Last Maintenance">
              <Input
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
              />
            </FormField>

            <FormField label="Next Maintenance">
              <Input
                type="date"
                value={formData.nextMaintenance}
                onChange={(e) => handleInputChange('nextMaintenance', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter equipment description"
              rows={3}
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {equipment ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  {equipment ? 'Update Equipment' : 'Add Equipment'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddEquipmentModal