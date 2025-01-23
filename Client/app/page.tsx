'use client'

import { useAuth } from '@/contexts/AuthContext'
export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to RBAC DEMO</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <>
          <div className="text-center">
            {user && user.role === "ADMIN" ? (
              <p className="text-xl font-semibold">You are an Admin</p>
            ) : (
              <p className="text-xl font-semibold">You are a User</p>
            )}
          </div>

        </>


      </div>
    </div>
  )
}

