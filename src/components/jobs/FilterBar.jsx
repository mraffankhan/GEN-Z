import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { createPortal } from 'react-dom'

const FilterDropdown = ({ label, options, activeValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef(null)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 200 })

    // Update position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
                width: Math.max(rect.width, 200) // Min width 200px
            })
        }
    }, [isOpen])

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                // Check if click is inside the portal dropdown
                const dropdown = document.getElementById(`dropdown-${label}`)
                if (dropdown && !dropdown.contains(event.target)) {
                    setIsOpen(false)
                }
            }
        }

        // Handle scroll to close/update (optional, but closing is safer for fixed pos)
        const handleScroll = () => setIsOpen(false)

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            window.addEventListener('scroll', handleScroll, true)
            window.addEventListener('resize', handleScroll)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll, true)
            window.removeEventListener('resize', handleScroll)
        }
    }, [isOpen, label])

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border
                    ${activeValue && activeValue !== 'All'
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                `}
            >
                {activeValue && activeValue !== 'All' ? activeValue : label}
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && createPortal(
                <div
                    id={`dropdown-${label}`}
                    className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-[9999] overflow-y-auto"
                    style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        minWidth: '200px',
                        maxHeight: '300px'
                    }}
                >
                    <button
                        onClick={() => {
                            onSelect('All')
                            setIsOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${!activeValue || activeValue === 'All' ? 'font-semibold text-neon-purple' : 'text-gray-600'}`}
                    >
                        All {label}s
                    </button>
                    {options.map(option => (
                        <button
                            key={option}
                            onClick={() => {
                                onSelect(option)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${activeValue === option ? 'font-semibold text-neon-purple bg-purple-50/50' : 'text-gray-600'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    )
}

const FilterBar = ({ filters, activeFilters, onFilterChange, onClearAll }) => {
    const hasActiveFilters = Object.values(activeFilters).some(val => val !== 'All')

    if (!filters || filters.length === 0) return null

    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 w-full px-1 relative">
            {filters.map(filter => (
                <FilterDropdown
                    key={filter.id}
                    label={filter.label}
                    options={filter.options}
                    activeValue={activeFilters[filter.id]}
                    onSelect={(value) => onFilterChange(filter.id, value)}
                />
            ))}

            {hasActiveFilters && (
                <button
                    onClick={onClearAll}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 rounded-full transition-colors whitespace-nowrap ml-auto"
                >
                    <X className="w-3 h-3" />
                    Clear
                </button>
            )}
        </div>
    )
}

export default FilterBar
