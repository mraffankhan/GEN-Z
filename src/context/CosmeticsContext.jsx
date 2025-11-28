import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const CosmeticsContext = createContext()

export const CosmeticsProvider = ({ children }) => {
    const [cosmeticsMap, setCosmeticsMap] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCosmetics()
    }, [])

    const fetchCosmetics = async () => {
        try {
            const { data, error } = await supabase
                .from('cosmetics_items')
                .select('*')

            if (error) throw error

            const map = {}
            data?.forEach(item => {
                map[item.id] = item
            })
            setCosmeticsMap(map)
        } catch (error) {
            console.error('Error fetching cosmetics definitions:', error)
        } finally {
            setLoading(false)
        }
    }

    // Helper to get item definition by ID
    const getCosmetic = (id) => cosmeticsMap[id] || null

    // Helper to resolve style/class from ID or fallback to value if not an ID (legacy support)
    const resolveBorder = (idOrValue) => {
        if (!idOrValue) return 'border border-gray-200'

        // Check if it's a UUID (simple check)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrValue)

        if (isUUID) {
            const item = cosmeticsMap[idOrValue]
            if (item) {
                // Return the color class or special style
                return item.color || 'border border-gray-200'
            }
            return 'border border-gray-200' // Unknown ID
        }

        // Legacy: return value directly (e.g. "border-red-500")
        return idOrValue
    }

    const resolveBadge = (idOrValue) => {
        if (!idOrValue) return null

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrValue)

        if (isUUID) {
            const item = cosmeticsMap[idOrValue]
            return item ? item.icon : null
        }

        return idOrValue // Legacy icon name
    }

    return (
        <CosmeticsContext.Provider value={{
            cosmeticsMap,
            getCosmetic,
            resolveBorder,
            resolveBadge,
            loading
        }}>
            {children}
        </CosmeticsContext.Provider>
    )
}

export const useCosmetics = () => useContext(CosmeticsContext)
