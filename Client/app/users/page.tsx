"use client";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUsers } from '@/utils/fakeBackend'
import { User } from "@/types"
import { CreateUserDialog } from "./CreateUser"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers({ params: { region: user?.region } })
      setUsers(data)
    }
    fetchUsers()
  }, [])
  
  if (!user) return;
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">

        <h1 className="text-3xl font-bold mb-8">Users</h1>
        <CreateUserDialog />
      </div>
      {/* <div className="grid gap-6 "> */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => (
          UserCard(user)
        ))}
      </div>
    </div>
  )
}

function UserCard(user: User) {
  return <Link key={user.id} href={`/users/${user.id}`}>
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge>{user.role}</Badge>
          {user.isVerified && <Badge>{"verified"}</Badge>}
          {!user.isVerified && <Badge variant={"destructive"}>{"Unverified"}</Badge>}
        </div>
        <div className="flex">
          <Badge>{user.region}</Badge>
        </div>
      </CardHeader>
      {user.hospitalId && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hospital ID: {user.hospitalId}
          </p>
        </CardContent>
      )}
    </Card>
  </Link>
}

