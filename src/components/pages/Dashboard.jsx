import React, { useState, useEffect } from 'react'
import StatCard from '@/components/molecules/StatCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import WeatherWidget from '@/components/organisms/WeatherWidget'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import farmService from '@/services/api/farmService'
import cropService from '@/services/api/cropService'
import taskService from '@/services/api/taskService'
import transactionService from '@/services/api/transactionService'
import { format, isThisWeek, isPast } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    transactions: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [farms, crops, tasks, transactions] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll()
      ])
      setData({ farms, crops, tasks, transactions })
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading rows={4} />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const upcomingTasks = data.tasks
    .filter(task => !task.completed && isThisWeek(new Date(task.dueDate)))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const overdueTasks = data.tasks.filter(task => !task.completed && isPast(new Date(task.dueDate)))

  const recentTransactions = data.transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const totalIncome = data.transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = Math.abs(data.transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const netProfit = totalIncome - totalExpenses

const activeCrops = data.crops.filter(crop => ['planted', 'growing'].includes((crop.status ?? '').toLowerCase()))
  const readyCrops = data.crops.filter(crop => (crop.status ?? '').toLowerCase() === 'ready')

  const getFarmName = (farmId) => {
    const farm = data.farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const getCropName = (cropId) => {
    const crop = data.crops.find(c => c.Id === cropId)
    return crop ? crop.name : 'Unknown Crop'
  }

  const getPriorityColor = (priority) => {
switch ((priority ?? '').toLowerCase()) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on your farms.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/tasks')}>
            <ApperIcon name="CheckSquare" size={16} className="mr-2" />
            View Tasks
          </Button>
          <Button variant="primary" onClick={() => navigate('/farms')}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Farm
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={data.farms.length}
          icon="MapPin"
          gradient={true}
        />
        <StatCard
          title="Active Crops"
          value={activeCrops.length}
          icon="Sprout"
          trend={readyCrops.length > 0 ? "up" : undefined}
          trendValue={readyCrops.length > 0 ? `${readyCrops.length} ready` : undefined}
        />
        <StatCard
          title="Pending Tasks"
          value={data.tasks.filter(t => !t.completed).length}
          icon="CheckSquare"
          trend={overdueTasks.length > 0 ? "down" : undefined}
          trendValue={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : undefined}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon="DollarSign"
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={`${totalIncome > 0 ? '+' : ''}${formatCurrency(totalIncome - totalExpenses)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </div>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg">
                        <ApperIcon name="CheckSquare" size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {getFarmName(task.farmId)} • {getCropName(task.cropId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <span className="text-sm text-gray-600">
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No upcoming tasks this week</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/tasks')}
                >
                  Create New Task
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Weather Widget */}
        <div>
          <WeatherWidget compact={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/finances')}>
              View All
            </Button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.amount > 0 
                        ? 'bg-gradient-to-br from-success to-green-600' 
                        : 'bg-gradient-to-br from-error to-red-600'
                    }`}>
                      <ApperIcon 
                        name={transaction.amount > 0 ? "TrendingUp" : "TrendingDown"} 
                        size={16} 
                        className="text-white" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-success' : 'text-error'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="DollarSign" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No transactions recorded yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/finances')}
              >
                Add Transaction
              </Button>
            </div>
          )}
        </Card>

        {/* Farm Overview */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Farm Overview</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/farms')}>
              Manage Farms
            </Button>
          </div>
          {data.farms.length > 0 ? (
            <div className="space-y-3">
              {data.farms.slice(0, 4).map((farm) => {
                const farmCrops = data.crops.filter(crop => crop.farmId === farm.Id)
                const farmTasks = data.tasks.filter(task => task.farmId === farm.Id && !task.completed)
                
                return (
                  <div key={farm.Id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{farm.name}</h3>
                      <span className="text-sm text-gray-600">{farm.size} {farm.unit}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{farmCrops.length} crops</span>
                      <span>{farmTasks.length} pending tasks</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="MapPin" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No farms added yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/farms')}
              >
                Add Your First Farm
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard