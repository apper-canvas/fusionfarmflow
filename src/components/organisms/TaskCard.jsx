import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format, isOverdue, isPast } from 'date-fns'

const TaskCard = ({ task, farmName, cropName, onEdit, onDelete, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'AlertCircle'
      case 'medium': return 'Clock'
      case 'low': return 'Minus'
      default: return 'Circle'
    }
  }

const isTaskOverdue = task.due_date_c && isPast(new Date(task.due_date_c)) && !task.completed_c
  const taskIcon = task.completed_c ? 'CheckCircle' : getPriorityIcon(task.priority_c)

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-l-4 ${
task.completed_c 
        ? 'border-l-success bg-green-50' 
        : isTaskOverdue 
        ? 'border-l-error' 
        : 'border-l-secondary-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
task.completed_c 
              ? 'bg-gradient-to-br from-success to-green-600' 
              : isTaskOverdue
              ? 'bg-gradient-to-br from-error to-red-600'
              : 'bg-gradient-to-br from-secondary-500 to-secondary-600'
          }`}>
            <ApperIcon name={taskIcon} size={24} className="text-white" />
          </div>
          <div className="flex-1">
<h3 className={`text-lg font-semibold ${task.completed_c ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
              {task.title_c}
            </h3>
            <p className="text-sm text-gray-600">{farmName} • {cropName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
<Badge variant={getPriorityColor(task.priority_c)}>{task.priority_c}</Badge>
          {task.completed_c && <Badge variant="success">Completed</Badge>}
          {isTaskOverdue && <Badge variant="error">Overdue</Badge>}
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="text-sm">
          <span className="text-gray-600 block">Due Date</span>
<span className={`font-medium ${isTaskOverdue ? 'text-error' : ''}`}>
            {task.due_date_c ? format(new Date(task.due_date_c), 'MMM dd, yyyy') : 'No due date'}
          </span>
        </div>
{task.description_c && (
          <div className="text-sm">
            <span className="text-gray-600 block">Description</span>
            <p className="text-gray-700 text-xs bg-white p-2 rounded border">{task.description_c}</p>
          </div>
        )}
{task.completed_at_c && (
          <div className="text-sm">
            <span className="text-gray-600 block">Completed At</span>
            <span className="font-medium text-success">
              {task.completed_at_c ? format(new Date(task.completed_at_c), 'MMM dd, yyyy HH:mm') : 'Invalid date'}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
{!task.completed_c && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onComplete(task.Id)}
            className="flex-1"
          >
            <ApperIcon name="Check" size={16} className="mr-2" />
            Complete
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
className={task.completed_c ? 'flex-1' : ''}
        >
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.Id)}
          className="text-error hover:bg-red-50 hover:text-error"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default TaskCard