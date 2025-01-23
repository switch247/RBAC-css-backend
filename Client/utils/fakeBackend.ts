/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { User } from '@/types'
import { get, put, post, del } from './api_helper'

// Simulated database
// let users: User[] = [
//   { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', password: 'password' },
//   { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'HOSPITAL_ADMIN', password: 'password', hospitalId: '1' },
//   { id: '3', name: 'Jane Smith', email: 'jefery@example.com', role: 'SUPER_ADMIN', password: 'password', hospitalId: '1' },
// ]


// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth functions
export const login = async (email: string, password: string): Promise<{ user: User, token: string } | null> => {
  await delay(500) // Simulate network delay
  const response = await post("auth/login", { email, password })
  const { user, token } = response.data
  if (user) {
    const { password, ...userWithoutPassword } = user
    return { user: { ...userWithoutPassword }, token }
  }
  return null
}


export const register = async (user: Omit<User, 'id'>): Promise<User | null> => {
  const response = await post("auth/register", { ...user })
  const newUser = response.data
  if (newUser) {
    const { password, ...userWithoutPassword } = newUser

    return userWithoutPassword
  }
  return null
}

export const getUsers = async (config?: Record<string, any>): Promise<User[]> => {

  const data = await get('users', config).then((response) => {
    return response.map((user: User) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  })

  return data;
}

export const getUser = async (id: string, config?: Record<string, any>): Promise<User | null> => {

  console.log(config)
  const user = await get(`users/${id}`, config);
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  const response = await put(`users/${id}`, data)
  return response.data
}

export const updateProfile = async (id: string, data: Partial<User>): Promise<User | null> => {
  const response = await put(`users/${id}`, data)
  return response.data
}

export const deleteUser = async (userId: string): Promise<unknown | null> => {
  return await del(`users/${userId}`)
}




// Mock function to send OTP
export const sendOTP = async (phoneNumber: string) => {
  console.log(`OTP sent to ${phoneNumber}`)
  const response = await post("auth/send-otp", { phoneNumber })
  const { user, token } = response.data

  return { success: true }
}

// Mock function to verify OTP
export const verifyOTP = async (phoneNumber: string, otp: string): Promise<{ user: User, token: string } | null> => {

  // if (otp === '123456') { // Mock valid OTP
  //   return {
  //     user: { id: '2', phoneNumber, username: 'John Doe', email: 'john@example.com', role: 'USER', password: 'password', isVerified: true, isLocked: false, failedAttempts: 0 },
  //     token: 'fake-token-for-phone-login',
  //   }
  // }
  // throw new Error('Invalid OTP')
  const response = await post("auth/otp-login", { phoneNumber, otp })
  const { user, token } = response.data
  if (user) {
    const { password, ...userWithoutPassword } = user
    return { user: { ...userWithoutPassword }, token }
  }
  throw new Error('Invalid OTP')

}