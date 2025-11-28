import React from 'react'
import { Loader2 } from 'lucide-react'

const BaseButton = ({
    children,
    onClick,
    variant = 'primary', // primary, secondary, outline, ghost
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    fullWidth = false
}) => {
    const baseStyles = "font-medium rounded-xl py-3 px-5 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20",
        secondary: "bg-gray-100 text-text-primary hover:bg-gray-200",
        outline: "border border-gray-200 text-text-primary hover:bg-gray-50",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-gray-50"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    )
}

export default BaseButton
