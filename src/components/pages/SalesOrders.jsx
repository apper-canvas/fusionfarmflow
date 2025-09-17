import React, { useState, useEffect } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import SalesOrderCard from '@/components/organisms/SalesOrderCard'
import AddSalesOrderModal from '@/components/organisms/AddSalesOrderModal'
import salesOrderService from '@/services/api/salesOrderService'
import { toast } from 'react-toastify'

const SalesOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, sortBy])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await salesOrderService.getAll()
      setOrders(data)
    } catch (err) {
      setError('Failed to load sales orders. Please try again.')
      console.error('Error loading sales orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders.filter(order => {
      const matchesSearch = !searchTerm || 
        (order.Name && order.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_name_c && order.customer_name_c.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesSearch
    })

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.order_date_c || 0) - new Date(a.order_date_c || 0)
        case 'customer':
          return (a.customer_name_c || '').localeCompare(b.customer_name_c || '')
        case 'amount':
          return (b.total_amount_c || 0) - (a.total_amount_c || 0)
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }

  const handleAddOrder = () => {
    setSelectedOrder(null)
    setShowModal(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this sales order?')) {
      return
    }

    try {
      await salesOrderService.delete(orderId)
      await loadOrders() // Refresh the list
    } catch (err) {
      toast.error('Failed to delete sales order')
      console.error('Error deleting sales order:', err)
    }
  }

  const handleModalSubmit = async (orderData) => {
    try {
      if (selectedOrder) {
        await salesOrderService.update(selectedOrder.Id, orderData)
      } else {
        await salesOrderService.create(orderData)
      }
      setShowModal(false)
      setSelectedOrder(null)
      await loadOrders() // Refresh the list
    } catch (err) {
      console.error('Error saving sales order:', err)
      // Error handling is done in the service layer
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const getTotalValue = () => {
    return filteredOrders.reduce((sum, order) => sum + (order.total_amount_c || 0), 0)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadOrders} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your customer orders and track sales</p>
        </div>
        <Button variant="primary" onClick={handleAddOrder}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Sales Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="ShoppingCart" size={24} className="text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="DollarSign" size={24} className="text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalValue())}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="TrendingUp" size={24} className="text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Order</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredOrders.length > 0 ? getTotalValue() / filteredOrders.length : 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search orders by name or customer..."
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="customer">Sort by Customer</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Empty
          icon="ShoppingCart"
          message={searchTerm ? "No sales orders match your search" : "No sales orders yet"}
          description={searchTerm ? "Try adjusting your search terms" : "Create your first sales order to get started"}
          action={!searchTerm ? {
            label: "Add Sales Order",
            onClick: handleAddOrder
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <SalesOrderCard
              key={order.Id}
              order={order}
              onEdit={() => handleEditOrder(order)}
              onDelete={() => handleDeleteOrder(order.Id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddSalesOrderModal
          order={selectedOrder}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default SalesOrders