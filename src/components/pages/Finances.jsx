import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import SearchBar from '@/components/molecules/SearchBar'
import StatCard from '@/components/molecules/StatCard'
import TransactionCard from '@/components/organisms/TransactionCard'
import AddTransactionModal from '@/components/organisms/AddTransactionModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import transactionService from '@/services/api/transactionService'
import farmService from '@/services/api/farmService'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

const Finances = () => {
  const [transactions, setTransactions] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [farmFilter, setFarmFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ])
      setTransactions(transactionsData)
      setFarms(farmsData)
    } catch (err) {
      setError('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData)
        toast.success('Transaction updated successfully!')
      } else {
        await transactionService.create(transactionData)
        toast.success('Transaction created successfully!')
      }
      await loadData()
    } catch (error) {
      toast.error('Failed to save transaction')
      throw error
    }
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      await transactionService.delete(transactionId)
      toast.success('Transaction deleted successfully!')
      await loadData()
    } catch (error) {
      toast.error('Failed to delete transaction')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFarmName(transaction.farmId).toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesType = true
      if (typeFilter === 'income') {
        matchesType = transaction.amount > 0
      } else if (typeFilter === 'expense') {
        matchesType = transaction.amount < 0
      }
      
      const matchesFarm = farmFilter === 'all' || transaction.farmId === parseInt(farmFilter)
      
      return matchesSearch && matchesType && matchesFarm
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Calculate financial statistics
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const netProfit = totalIncome - totalExpenses

  // Current month stats
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  const thisMonthTransactions = transactions.filter(t => 
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  )
  
  const monthlyIncome = thisMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyExpenses = Math.abs(thisMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const typeOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expenses' }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
          <p className="text-gray-600 mt-1">Track your farm income, expenses, and financial performance</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon="TrendingUp"
          trend={monthlyIncome > 0 ? "up" : undefined}
          trendValue={monthlyIncome > 0 ? `+${formatCurrency(monthlyIncome)} this month` : undefined}
          gradient={true}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="TrendingDown"
          trend={monthlyExpenses > 0 ? "down" : undefined}
          trendValue={monthlyExpenses > 0 ? `-${formatCurrency(monthlyExpenses)} this month` : undefined}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon="DollarSign"
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={`${formatCurrency(monthlyIncome - monthlyExpenses)} this month`}
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          icon="Receipt"
          trend={thisMonthTransactions.length > 0 ? "up" : undefined}
          trendValue={thisMonthTransactions.length > 0 ? `${thisMonthTransactions.length} this month` : undefined}
        />
      </div>

      {/* Filters */}
      {transactions.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions by description, category, or farm..."
            />
          </div>
          <div className="flex gap-4">
            <div className="w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="w-48">
              <select
                value={farmFilter}
                onChange={(e) => setFarmFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Farms</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.Id}
              transaction={transaction}
              farmName={getFarmName(transaction.farmId)}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No transactions recorded yet"
          description="Start tracking your farm finances by adding your first income or expense transaction."
          actionLabel="Add Your First Transaction"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <Empty
          icon="Search"
          title="No transactions match your criteria"
          description="Try adjusting your search terms or filters, or add a new transaction."
          actionLabel="Add New Transaction"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add/Edit Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  )
}

export default Finances