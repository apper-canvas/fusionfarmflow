import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input