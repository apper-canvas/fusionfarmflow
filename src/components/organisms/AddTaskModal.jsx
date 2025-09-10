import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import cropService from '@/services/api/cropService'
import { format } from 'date-fns'

const AddTaskModal = ({ isOpen, onClose, onSave, task = null }) => {
const [formData, setFormData] = useState({
    farm_id_c: '',
    crop_id_c: '',
    title_c: '',
    description_c: '',
    due_date_c: '',
    priority_c: 'medium'
  })
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [allCrops, setAllCrops] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadFarms()
      loadCrops()
    }
  }, [isOpen])

useEffect(() => {
    if (task) {
setFormData({
        farm_id_c: task.farm_id_c?.Id || task.farm_id_c,
        crop_id_c: task.crop_id_c?.Id || task.crop_id_c,
        title_c: task.title_c,
        description_c: task.description_c || '',
        due_date_c: format(new Date(task.due_date_c), 'yyyy-MM-dd'),
        priority_c: task.priority_c
      })
} else {
      setFormData({
        farm_id_c: '',
        crop_id_c: '',
        title_c: '',
        description_c: '',
        due_date_c: '',
        priority_c: 'medium'
      })
    }
    setErrors({})
  }, [task, isOpen])

  useEffect(() => {
if (formData.farm_id_c) {
const farmCrops = allCrops.filter(crop => crop.farm_id_c === parseInt(formData.farm_id_c))
      setCrops(farmCrops)
      if (!farmCrops.find(crop => crop.Id === parseInt(formData.crop_id_c))) {
        setFormData(prev => ({ ...prev, crop_id_c: '' }))
      }
    } else {
      setCrops([])
      setFormData(prev => ({ ...prev, crop_id_c: '' }))
    }
  }, [formData.farm_id_c, allCrops])

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll()
      setFarms(data)
    } catch (error) {
      console.error('Failed to load farms:', error)
    }
  }

  const loadCrops = async () => {
    try {
      const data = await cropService.getAll()
      setAllCrops(data)
    } catch (error) {
      console.error('Failed to load crops:', error)
    }
  }

  const validate = () => {
    const newErrors = {}
if (!formData.farm_id_c) newErrors.farm_id_c = 'Farm selection is required'
    if (!formData.crop_id_c) newErrors.crop_id_c = 'Crop selection is required'
    if (!formData.title_c.trim()) newErrors.title_c = 'Task title is required'
    if (!formData.due_date_c) newErrors.due_date_c = 'Due date is required'
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
      const taskData = {
...formData,
        farm_id_c: parseInt(formData.farm_id_c),
        crop_id_c: parseInt(formData.crop_id_c),
        due_date_c: formData.due_date_c
      }
      await onSave(taskData)
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save task' })
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
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="cropId">Crop *</Label>
              <select
                id="cropId"
value={formData.crop_id_c}
                onChange={(e) => handleChange('crop_id_c', e.target.value)}
                disabled={!formData.farm_id_c}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select a crop</option>
                {crops.map(crop => (
<option key={crop.Id} value={crop.Id}>{crop.name_c} ({crop.variety_c})</option>
                ))}
              </select>
{errors.crop_id_c && <p className="text-sm text-error mt-1">{errors.crop_id_c}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
value={formData.title_c}
onChange={(e) => handleChange('title_c', e.target.value)}
              placeholder="e.g., Water crops, Apply fertilizer, Harvest"
            />
{errors.title_c && <p className="text-sm text-error mt-1">{errors.title_c}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
value={formData.description_c}
onChange={(e) => handleChange('description_c', e.target.value)}
              placeholder="Additional details about this task..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
value={formData.due_date_c}
onChange={(e) => handleChange('due_date_c', e.target.value)}
              />
{errors.due_date_c && <p className="text-sm text-error mt-1">{errors.due_date_c}</p>}
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
value={formData.priority_c}
onChange={(e) => handleChange('priority_c', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
                  {task ? 'Update Task' : 'Add Task'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal