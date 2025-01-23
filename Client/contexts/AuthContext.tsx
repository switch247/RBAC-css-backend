'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = Cookies.get('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }) // expires in 7 days
    Cookies.set('token', JSON.stringify(token), { expires: 7 }) // expires in 7 days
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('user')
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

