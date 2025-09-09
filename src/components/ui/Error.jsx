import React from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
      <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error