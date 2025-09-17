import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import FarmerCard from '@/components/organisms/FarmerCard'
import AddFarmerModal from '@/components/organisms/AddFarmerModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import farmerService from '@/services/api/farmerService'
import { toast } from 'react-toastify'

const Farmers = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFarmer, setEditingFarmer] = useState(null)

  useEffect(() => {
    loadFarmers()
  }, [])

  const loadFarmers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await farmerService.getAll()
      setFarmers(data)
    } catch (err) {
      setError('Failed to load farmers')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFarmer = async (farmerData) => {
    try {
      if (editingFarmer) {
        await farmerService.update(editingFarmer.Id, farmerData)
        toast.success('Farmer updated successfully!')
      } else {
        await farmerService.create(farmerData)
        toast.success('Farmer created successfully!')
      }
      await loadFarmers()
    } catch (error) {
      toast.error('Failed to save farmer')
      throw error
    }
  }

  const handleEditFarmer = (farmer) => {
    setEditingFarmer(farmer)
    setIsModalOpen(true)
  }

  const handleDeleteFarmer = async (farmerId) => {
    if (!window.confirm('Are you sure you want to delete this farmer?')) return
    
    try {
      await farmerService.delete(farmerId)
      toast.success('Farmer deleted successfully!')
      await loadFarmers()
    } catch (error) {
      toast.error('Failed to delete farmer')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFarmer(null)
  }

  const filteredFarmers = farmers.filter(farmer =>
    (farmer.name_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (farmer.contact_information_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (farmer.Tags?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadFarmers} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmers</h1>
          <p className="text-gray-600 mt-1">Manage your farmer contacts and information</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Farmer
        </Button>
      </div>

      {/* Search Bar */}
      {farmers.length > 0 && (
        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search farmers by name, contact, or tags..."
          />
        </div>
      )}

      {/* Farmers Grid */}
      {filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <FarmerCard
              key={farmer.Id}
              farmer={farmer}
              onEdit={handleEditFarmer}
              onDelete={handleDeleteFarmer}
            />
          ))}
        </div>
      ) : farmers.length === 0 ? (
        <Empty
          icon="Users"
          title="No farmers found"
          description="Start by adding your first farmer to begin managing your agricultural contacts."
          actionLabel="Add Your First Farmer"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <Empty
          icon="Search"
          title="No farmers match your search"
          description="Try adjusting your search terms or add a new farmer."
          actionLabel="Add New Farmer"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add/Edit Modal */}
      <AddFarmerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFarmer}
        farmer={editingFarmer}
      />
    </div>
  )
}

export default Farmers