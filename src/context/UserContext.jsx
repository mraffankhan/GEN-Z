import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId, userEmail) => {
        try {
            // 1. Try to fetch existing profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (data) {
                setProfile(data)
            } else {
                // 2. If not found, create it
                console.log('Profile missing, creating new one...')
                const newProfile = {
                    id: userId,
                    email: userEmail,


                    created_at: new Date().toISOString()
                }

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert(newProfile)

                if (!insertError) {
                    setProfile(newProfile)
                } else {
                    console.error('Error creating profile:', insertError)
                }
            }
        } catch (err) {
            console.error('Profile fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email)
            } else {
                setProfile(null)
                setLoading(false) // Ensure loading is set to false even if no user
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
        setProfile(null)
    }

    const value = {
        session,
        user,
        profile,
        loading,
        logout,
        refreshProfile: () => {
            if (user) fetchProfile(user.id, user.email)
        }
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
