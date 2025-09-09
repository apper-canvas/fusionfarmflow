import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Card.displayName = "Card"

export default Card