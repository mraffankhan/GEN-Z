import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-purple transition-colors" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full bg-white text-gray-900 pl-11 pr-4 py-3.5 rounded-[20px] border border-gray-200 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 transition-all placeholder-gray-400 text-[15px] shadow-sm"
            />
        </div>
    )
}

export default SearchBar
