'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { register } from '@/utils/fakeBackend'
import { UserRole } from '@/types'

export function CreateUserDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [role, setRole] = useState<UserRole>('USER')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!username || !email || !password || !role || !phoneNumber) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            const user = await register({
                username,
                email,
                password,
                phoneNumber,
                isVerified: false,
                role
            })
            if (user) {
                setLoading(false)
                console.log(user)
                router.push('/auth/login')
                setIsOpen(false)
            } else {
                setLoading(false)
                setError('Registration failed. Please try again.')
            }
        } catch (err) {
            setLoading(false)
            const errorMessage = (err as any).response?.data?.error || (err as any).message || 'An unknown error occurred'
            setError(`An error occurred: ${errorMessage}. Please try again.`)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new user.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="space-y-2">
                            <Label htmlFor="username">User Name</Label>
                            <Input
                                id="username"
                                required
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
