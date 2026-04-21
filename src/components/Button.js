import React, { useState } from 'react'

const Button = ({name}) => {
  const [isActive, setIsActive] = useState(name === "All");
  
  return (
    <button 
      onClick={() => setIsActive(!isActive)}
      className={`py-1.5 px-3 mr-3 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-white text-black' 
          : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
      }`}
    >
      {name}
    </button>
  )
}

export default Button;
