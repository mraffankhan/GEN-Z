import React from 'react'

const BaseInput = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`relative ${className}`}>
            {Icon && (
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-subtle" />
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
          w-full bg-white border border-gray-200 rounded-xl py-3 md:py-3.5
          ${Icon ? 'pl-11' : 'pl-4'} pr-4
          text-text-primary placeholder-text-subtle text-sm
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
          transition-all duration-200
        `}
                {...props}
            />
        </div>
    )
}

export default BaseInput
