import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api, body, refreshSession, setAccessToken } from '../../../shared/lib/api'
import type { User } from '../../../shared/types'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (
    data: { email: string; password: string; name?: string },
    register?: boolean,
  ) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (user: User) => void
}
const AuthContext = createContext<AuthState | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()
  useEffect(() => {
    let active = true
    void refreshSession()
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  const signIn: AuthState['signIn'] = async (input, register = false) => {
    const data = await api<{ accessToken: string; user: User }>(
      register ? '/auth/register' : '/auth/login',
      { method: 'POST', body: body(input) },
    )
    queryClient.clear()
    setAccessToken(data.accessToken)
    setUser(data.user)
  }
  const signOut = async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      setAccessToken(null)
      setUser(null)
      queryClient.clear()
    }
  }
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('Auth provider missing')
  return value
}
