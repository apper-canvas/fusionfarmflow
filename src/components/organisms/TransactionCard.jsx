import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const TransactionCard = ({ transaction, farmName, onEdit, onDelete }) => {
const isIncome = transaction.type_c === 'income'
  
  const getTypeIcon = (type) => {
    return type === 'income' ? 'TrendingUp' : 'TrendingDown'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-l-4 ${
      isIncome ? 'border-l-success' : 'border-l-error'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
            isIncome 
              ? 'bg-gradient-to-br from-success to-green-600' 
              : 'bg-gradient-to-br from-error to-red-600'
          }`}>
<ApperIcon name={getTypeIcon(transaction.type_c)} size={24} className="text-white" />
          </div>
          <div>
<h3 className="text-lg font-semibold text-gray-900">{transaction.description_c}</h3>
            <p className="text-sm text-gray-600">{farmName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isIncome ? 'text-success' : 'text-error'}`}>
{isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount_c))}
          </p>
          <Badge variant={isIncome ? 'success' : 'error'}>
{transaction.type_c}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Category</span>
<span className="font-medium capitalize">{transaction.category_c}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Date</span>
<span className="font-medium">{transaction.date_c ? format(new Date(transaction.date_c), 'MMM dd, yyyy') : 'No date'}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(transaction)}
          className="flex-1"
        >
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(transaction.Id)}
          className="text-error hover:bg-red-50 hover:text-error"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default TransactionCard