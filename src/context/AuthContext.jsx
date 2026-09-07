import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, supabaseConfigError } from '../lib/supabase'
import {
  clearLocalSessionUser,
  getLocalSessionUser,
  registerLocalAuth,
  signInLocalAuth,
} from '../lib/localAuth'

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const normalizeUser = (user) => {
  if (!user) return null
  return {
    ...user,
    name: user.user_metadata?.full_name || user.email,
  }
}

const isFetchStyleError = (error) => /fetch failed|failed to fetch|networkerror|network request/i.test(error?.message || '')

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveSessionUser = (sessionUser) => {
      if (sessionUser) return normalizeUser(sessionUser)
      if (supabaseConfigError) return normalizeUser(getLocalSessionUser())
      clearLocalSessionUser()
      return null
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setCurrentUser(resolveSessionUser(session?.user))
        setLoading(false)
      })
      .catch(() => {
        setCurrentUser(normalizeUser(getLocalSessionUser()))
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(resolveSessionUser(session?.user))
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) return { success: true, user: normalizeUser(data.user) }

      if (isFetchStyleError(error)) {
        const fallback = signInLocalAuth({ email, password })
        if (fallback.success) {
          setCurrentUser(normalizeUser(fallback.user))
          return { ...fallback, user: normalizeUser(fallback.user) }
        }
        return { success: false, message: 'Sign-in temporarily unavailable. Please try again.' }
      }

      return { success: false, message: error.message }
    } catch (caughtError) {
      const fallback = signInLocalAuth({ email, password })
      if (fallback.success) {
        setCurrentUser(normalizeUser(fallback.user))
        return { ...fallback, user: normalizeUser(fallback.user) }
      }

      const message = caughtError instanceof TypeError
        ? 'Sign-in temporarily unavailable. Please try again.'
        : 'Unable to sign in right now. Please try again.'

      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })

      if (!error) {
        if (!data.session) {
          const fallback = registerLocalAuth({ name, email, password })
          if (fallback.success) {
            const normalizedUser = normalizeUser(fallback.user)
            setCurrentUser(normalizedUser)
            return {
              ...fallback,
              user: normalizedUser,
              skippedEmailConfirmation: true,
            }
          }

          const existingLocalUser = signInLocalAuth({ email, password })
          if (existingLocalUser.success) {
            const normalizedUser = normalizeUser(existingLocalUser.user)
            setCurrentUser(normalizedUser)
            return {
              ...existingLocalUser,
              user: normalizedUser,
              skippedEmailConfirmation: true,
            }
          }

          return {
            success: false,
            message: 'Account created, but automatic sign-in could not be completed. Please sign in manually.',
          }
        }
        return { success: true, user: normalizeUser(data.user) }
      }

      if (isFetchStyleError(error)) {
        const fallback = registerLocalAuth({ name, email, password })
        if (fallback.success) {
          setCurrentUser(normalizeUser(fallback.user))
          return { ...fallback, user: normalizeUser(fallback.user) }
        }
        return fallback
      }

      return { success: false, message: error.message }
    } catch (caughtError) {
      const fallback = registerLocalAuth({ name, email, password })
      if (fallback.success) {
        setCurrentUser(normalizeUser(fallback.user))
        return { ...fallback, user: normalizeUser(fallback.user) }
      }

      const message = caughtError instanceof TypeError
        ? 'Registration temporarily unavailable. Please try again.'
        : 'Unable to complete registration right now. Please try again.'

      return { success: false, message }
    }
  }

  const logout = () => {
    clearLocalSessionUser()
    supabase.auth.signOut()
    setCurrentUser(null)
  }

  const isAdmin = currentUser?.user_metadata?.role === 'admin'

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
