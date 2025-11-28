import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

const FilterBar = ({ filters, activeFilters, onFilterChange }) => {
    const [openDropdown, setOpenDropdown] = useState(null)

    const toggleDropdown = (id) => {
        setOpenDropdown(prev => prev === id ? null : id)
    }

    return (
        <div className="sticky top-[72px] z-30 bg-[#FAFAFA]/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-100/50">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {filters.map(filter => {
                    const isActive = activeFilters[filter.id] && activeFilters[filter.id] !== 'All'

                    return (
                        <div key={filter.id} className="relative flex-shrink-0">
                            <button
                                onClick={() => toggleDropdown(filter.id)}
                                className={`
                                    flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border
                                    ${isActive
                                        ? 'bg-white text-gray-900 border-neon-purple shadow-sm ring-1 ring-neon-purple/20'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                                `}
                            >
                                {isActive ? activeFilters[filter.id] : filter.label}
                                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === filter.id && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setOpenDropdown(null)}
                                    ></div>
                                    <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => {
                                                onFilterChange(filter.id, 'All')
                                                setOpenDropdown(null)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors ${!isActive ? 'font-semibold text-neon-purple' : 'text-gray-600'}`}
                                        >
                                            All {filter.label}s
                                        </button>
                                        {filter.options.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    onFilterChange(filter.id, option)
                                                    setOpenDropdown(null)
                                                }}
                                                className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors ${activeFilters[filter.id] === option ? 'font-semibold text-neon-purple bg-purple-50/50' : 'text-gray-600'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}

                {/* Clear Filters Button */}
                {Object.values(activeFilters).some(v => v !== 'All') && (
                    <button
                        onClick={() => {
                            Object.keys(activeFilters).forEach(key => onFilterChange(key, 'All'))
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors flex-shrink-0 ml-auto"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FilterBar
