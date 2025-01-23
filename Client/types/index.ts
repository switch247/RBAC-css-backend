export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  name?: string
  username: string
  phoneNumber: string
  isVerified: boolean
  email: string
  password?: string
  role: UserRole
  failedAttempts?: number
  isLocked?: boolean
  createdAt?: string
  updatedAt?: string
}

// export interface RoleAudit {

// }


