'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            RBAC DEMO
          </Link>
          <div className="flex space-x-4">
            {user && (
              <>
                {(user.role === 'ADMIN') && (
                  <>
                    <Link href="/users" className="hover:text-primary-foreground/80">Users</Link>
                  </>
                )}


              </>
            )}
            {!user ? (
              <>
                <Link href="/auth/login" className="hover:text-primary-foreground/80">Login</Link>
                <Link href="/auth/register" className="hover:text-primary-foreground/80">Register</Link>
              </>
            ) :
              (
                <>
                  <Link href="/profile" className="hover:text-primary-foreground/80">Profile</Link>
                  <Button variant="secondary" onClick={logout}>Logout</Button>
                </>
              )}
          </div>
        </div>
      </div>
    </nav>
  )
}

