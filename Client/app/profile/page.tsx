'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile } from '@/utils/fakeBackend'
import { useToast } from "@/hooks/use-toast"
import Cookies from 'js-cookie'
export default function ProfilePage() {
  const { user, login } = useAuth()
  const [username, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setName(user.username)
      setEmail(user.email)
      setRole(user.role)
      setPhoneNumber(user.phoneNumber)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      try {
        setLoading(true)
        // console.log("user:", user.id)
        const updatedUser = await updateProfile(user.id, { username, phoneNumber }) as unknown as { data: any }
        login(updatedUser.data, Cookies.get('token')!)
        toast({
          title: "Success",
          description: "Profile updated successfully.",
          style: { backgroundColor: 'green', color: 'white' }
        })

      } catch (error) {
        console.log("error:", error)
        toast({
          title: "Error",
          description: "Failed to update Profile. Please try again.",
          style: { backgroundColor: 'red', color: 'white' }

        })

      }
      finally {
        setLoading(false)
      }
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">PhoneNumber</Label>
              <Input
                id="username"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={role} readOnly />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} >Update Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

