import React, { useState } from 'react'
import { Info } from 'lucide-react'

export const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <Info
        className="w-4 h-4 text-primary cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-secondary rounded-md shadow-lg">
          {text}
        </div>
      )}
    </div>
  )
}

