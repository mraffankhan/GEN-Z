import React from 'react'

const BaseCard = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-card-bg rounded-2xl p-4 card-shadow border border-border/50
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-200' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    )
}

export default BaseCard
