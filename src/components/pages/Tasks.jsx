import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import TaskCard from '@/components/organisms/TaskCard'
import AddTaskModal from '@/components/organisms/AddTaskModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import taskService from '@/services/api/taskService'
import farmService from '@/services/api/farmService'
import cropService from '@/services/api/cropService'
import { toast } from 'react-toastify'
import { isPast } from 'date-fns'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ])
      setTasks(tasksData)
      setFarms(farmsData)
      setCrops(cropsData)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
await taskService.update(editingTask.Id, taskData)
        toast.success('Task updated successfully!')
      } else {
        await taskService.create(taskData)
        toast.success('Task created successfully!')
      }
      await loadData()
    } catch (error) {
      toast.error('Failed to save task')
      throw error
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      toast.success('Task deleted successfully!')
      await loadData()
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
const task = tasks.find(t => t.Id === taskId)
      if (!task) return

      const updatedTask = {
        ...task,
completed_c: true,
        completedAt: new Date().toISOString()
      }

      await taskService.update(taskId, updatedTask)
      toast.success('Task completed successfully!')
      await loadData()
    } catch (error) {
      toast.error('Failed to complete task')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const getFarmName = (farmId) => {
const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const getCropName = (cropId) => {
const crop = crops.find(c => c.Id === cropId)
    return crop ? crop.name : 'Unknown Crop'
  }

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = 
task.title_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFarmName(task.farm_id_c).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCropName(task.crop_id_c).toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesStatus = true
      if (statusFilter === 'completed') {
matchesStatus = task.completed_c
      } else if (statusFilter === 'pending') {
        matchesStatus = !task.completed_c
      } else if (statusFilter === 'overdue') {
        matchesStatus = !task.completed_c && isPast(new Date(task.due_date_c))
      }
      
const matchesPriority = priorityFilter === 'all' || task.priority_c.toLowerCase() === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      // Sort by completion status first, then by due date
if (a.completed_c !== b.completed_c) {
        return a.completed_c ? 1 : -1
      }
      return new Date(a.due_date_c) - new Date(b.due_date_c)
    })

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your farm tasks and track completion progress</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search tasks by title, farm, or crop..."
            />
          </div>
          <div className="flex gap-4">
            <div className="w-40">
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
            <div className="w-40">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
key={task.Id}
              task={task}
              farmName={getFarmName(task.farm_id_c)}
              cropName={getCropName(task.crop_id_c)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks created yet"
          description="Start organizing your farm work by creating your first task."
          actionLabel="Create Your First Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <Empty
          icon="Search"
          title="No tasks match your criteria"
          description="Try adjusting your search terms or filters, or create a new task."
          actionLabel="Create New Task"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add/Edit Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  )
}

export default Tasks