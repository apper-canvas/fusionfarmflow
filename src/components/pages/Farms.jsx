import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import FarmCard from '@/components/organisms/FarmCard'
import AddFarmModal from '@/components/organisms/AddFarmModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import { toast } from 'react-toastify'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)

  useEffect(() => {
    loadFarms()
  }, [])

  const loadFarms = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await farmService.getAll()
      setFarms(data)
    } catch (err) {
      setError('Failed to load farms')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFarm = async (farmData) => {
    try {
      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData)
        toast.success('Farm updated successfully!')
      } else {
        await farmService.create(farmData)
        toast.success('Farm created successfully!')
      }
      await loadFarms()
    } catch (error) {
      toast.error('Failed to save farm')
      throw error
    }
  }

  const handleEditFarm = (farm) => {
    setEditingFarm(farm)
    setIsModalOpen(true)
  }

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return
    
    try {
      await farmService.delete(farmId)
      toast.success('Farm deleted successfully!')
      await loadFarms()
    } catch (error) {
      toast.error('Failed to delete farm')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFarm(null)
  }

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadFarms} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">Manage your farm locations and properties</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Search Bar */}
      {farms.length > 0 && (
        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search farms by name or location..."
          />
        </div>
      )}

      {/* Farms Grid */}
      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              onEdit={handleEditFarm}
              onDelete={handleDeleteFarm}
            />
          ))}
        </div>
      ) : farms.length === 0 ? (
        <Empty
          icon="MapPin"
          title="No farms found"
          description="Start by adding your first farm to begin managing your agricultural operations."
          actionLabel="Add Your First Farm"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <Empty
          icon="Search"
          title="No farms match your search"
          description="Try adjusting your search terms or add a new farm."
          actionLabel="Add New Farm"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add/Edit Modal */}
      <AddFarmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFarm}
        farm={editingFarm}
      />
    </div>
  )
}

export default Farms