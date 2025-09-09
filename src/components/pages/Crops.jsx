import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import CropCard from '@/components/organisms/CropCard'
import AddCropModal from '@/components/organisms/AddCropModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import cropService from '@/services/api/cropService'
import farmService from '@/services/api/farmService'
import { toast } from 'react-toastify'

const Crops = () => {
  const [crops, setCrops] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ])
      setCrops(cropsData)
      setFarms(farmsData)
    } catch (err) {
      setError('Failed to load crops')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCrop = async (cropData) => {
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData)
        toast.success('Crop updated successfully!')
      } else {
        await cropService.create(cropData)
        toast.success('Crop created successfully!')
      }
      await loadData()
    } catch (error) {
      toast.error('Failed to save crop')
      throw error
    }
  }

  const handleEditCrop = (crop) => {
    setEditingCrop(crop)
    setIsModalOpen(true)
  }

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return
    
    try {
      await cropService.delete(cropId)
      toast.success('Crop deleted successfully!')
      await loadData()
    } catch (error) {
      toast.error('Failed to delete crop')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCrop(null)
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const filteredCrops = crops
    .filter(crop => {
      const matchesSearch = 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFarmName(crop.farmId).toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || crop.status.toLowerCase() === statusFilter
      
      return matchesSearch && matchesStatus
    })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'planted', label: 'Planted' },
    { value: 'growing', label: 'Growing' },
    { value: 'ready', label: 'Ready' },
    { value: 'harvested', label: 'Harvested' }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crops</h1>
          <p className="text-gray-600 mt-1">Track your crop plantings, growth, and harvest schedules</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Filters */}
      {crops.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search crops by name, variety, or farm..."
            />
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Crops Grid */}
      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.Id}
              crop={crop}
              farmName={getFarmName(crop.farmId)}
              onEdit={handleEditCrop}
              onDelete={handleDeleteCrop}
            />
          ))}
        </div>
      ) : crops.length === 0 ? (
        <Empty
          icon="Sprout"
          title="No crops planted yet"
          description="Start tracking your crops by adding your first planting record."
          actionLabel="Add Your First Crop"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <Empty
          icon="Search"
          title="No crops match your criteria"
          description="Try adjusting your search terms or filters, or add a new crop."
          actionLabel="Add New Crop"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add/Edit Modal */}
      <AddCropModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCrop}
        crop={editingCrop}
      />
    </div>
  )
}

export default Crops