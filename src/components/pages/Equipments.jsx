import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import EquipmentCard from '@/components/organisms/EquipmentCard'
import AddEquipmentModal from '@/components/organisms/AddEquipmentModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import equipmentService from '@/services/api/equipmentService'
import { toast } from 'react-toastify'

const Equipments = () => {
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)

  useEffect(() => {
    loadEquipments()
  }, [])

  const loadEquipments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await equipmentService.getAll()
      setEquipments(data)
    } catch (err) {
      setError('Failed to load equipments')
      console.error('Error loading equipments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEquipment = async (equipmentData) => {
    try {
      if (editingEquipment) {
        const updated = await equipmentService.update(editingEquipment.Id, equipmentData)
        setEquipments(prev => prev.map(eq => eq.Id === updated.Id ? updated : eq))
        toast.success('Equipment updated successfully')
        setEditingEquipment(null)
      } else {
        const newEquipment = await equipmentService.create(equipmentData)
        setEquipments(prev => [newEquipment, ...prev])
        toast.success('Equipment added successfully')
      }
    } catch (err) {
      toast.error(editingEquipment ? 'Failed to update equipment' : 'Failed to add equipment')
      console.error('Error saving equipment:', err)
      throw err
    }
  }

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment)
    setShowAddModal(true)
  }

  const handleDeleteEquipment = async (equipmentId) => {
    if (!confirm('Are you sure you want to delete this equipment?')) {
      return
    }

    try {
      await equipmentService.delete(equipmentId)
      setEquipments(prev => prev.filter(eq => eq.Id !== equipmentId))
      toast.success('Equipment deleted successfully')
    } catch (err) {
      toast.error('Failed to delete equipment')
      console.error('Error deleting equipment:', err)
    }
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingEquipment(null)
  }

  // Get unique types and statuses for filters
  const uniqueTypes = [...new Set(equipments.map(eq => eq.type))].sort()
  const uniqueStatuses = [...new Set(equipments.map(eq => eq.status))].sort()

  // Filter equipments
  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter
    const matchesType = typeFilter === 'all' || equipment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusStats = () => {
    const operational = equipments.filter(eq => eq.status === 'Operational').length
    const maintenance = equipments.filter(eq => eq.status === 'Maintenance').length
    const repair = equipments.filter(eq => eq.status === 'Repair').length
    const retired = equipments.filter(eq => eq.status === 'Retired').length

    return { operational, maintenance, repair, retired }
  }

  if (loading) return <Loading rows={3} />
  if (error) return <Error message={error} onRetry={loadEquipments} />

  const statusStats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipments</h1>
          <p className="text-gray-600 mt-1">Manage your farm equipment and machinery inventory</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-success to-green-600 rounded-lg">
              <ApperIcon name="CheckCircle" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusStats.operational}</p>
              <p className="text-sm text-gray-600">Operational</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-warning to-yellow-600 rounded-lg">
              <ApperIcon name="Settings" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusStats.maintenance}</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-error to-red-600 rounded-lg">
              <ApperIcon name="AlertTriangle" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusStats.repair}</p>
              <p className="text-sm text-gray-600">Needs Repair</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
              <ApperIcon name="Archive" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusStats.retired}</p>
              <p className="text-sm text-gray-600">Retired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search equipment by name, brand, model, or description..."
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      {filteredEquipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment) => (
            <EquipmentCard
              key={equipment.Id}
              equipment={equipment}
              onEdit={handleEditEquipment}
              onDelete={handleDeleteEquipment}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="Wrench"
          title="No equipment found"
          description={searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
            ? "No equipment matches your current filters" 
            : "Start by adding your first piece of equipment"
          }
        >
          {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Your First Equipment
            </Button>
          )}
        </Empty>
      )}

      {/* Add/Edit Equipment Modal */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={closeModal}
        onAdd={handleAddEquipment}
        equipment={editingEquipment}
      />
    </div>
  )
}

export default Equipments