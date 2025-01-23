/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext'
import { login, sendOTP, verifyOTP } from '@/utils/fakeBackend'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPhoneLogin, setShowPhoneLogin] = useState(false) // Toggle between email/password and phone/OTP
  const [recaptchaCode, setRecaptchaCode] = useState('') // Random reCAPTCHA code
  const [userRecaptchaInput, setUserRecaptchaInput] = useState('') // User input for reCAPTCHA
  const [otpSent, setOtpSent] = useState(false) // Track if OTP has been sent
  const router = useRouter()
  const { login: authLogin } = useAuth()

  // Generate a random reCAPTCHA code
  const generateRecaptchaCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase() // Random 6-character code
    setRecaptchaCode(code)
    return code
  }

  // Validate reCAPTCHA
  const validateRecaptcha = () => {
    return userRecaptchaInput.toUpperCase() === recaptchaCode
  }

  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateRecaptcha()) {
      setError('Invalid reCAPTCHA code. Please try again.')
      setLoading(false)
      generateRecaptchaCode() // Regenerate reCAPTCHA code
      return
    }

    try {
      const response = await login(email, password)
      if (response) {
        const { user, token } = response
        if (user) {
          authLogin(user, token)
          router.push('/')
        } else {
          setError('Invalid email or password')
        }
      }
    } catch (err) {
      console.log(err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle phone number + OTP login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateRecaptcha()) {
      setError('Invalid reCAPTCHA code. Please try again.')
      setLoading(false)
      generateRecaptchaCode() // Regenerate reCAPTCHA code
      return
    }

    try {
      if (!otpSent) {
        // Step 1: Send OTP
        await sendOTP(phoneNumber)
        setOtpSent(true) // Mark OTP as sent
        setError('OTP sent to your phone number.')
      } else {
        // Step 2: Verify OTP
        const response = await verifyOTP(phoneNumber, otp)
        if (response) {
          const { user, token } = response
          if (user) {
            authLogin(user, token)
            router.push('/')
          } else {
            setError('Invalid OTP')
          }
        }
      }
    } catch (err) {
      console.log(err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Toggle between email/password and phone/OTP login
  const toggleLoginMethod = () => {
    setShowPhoneLogin(!showPhoneLogin)
    setError('')
    setEmail('')
    setPassword('')
    setPhoneNumber('')
    setOtp('')
    setOtpSent(false) // Reset OTP sent state
    generateRecaptchaCode() // Regenerate reCAPTCHA code
  }

  // Generate reCAPTCHA code on component mount
  useState(() => {
    generateRecaptchaCode()
  })

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={showPhoneLogin ? handlePhoneLogin : handleEmailLogin}>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            {/* Email/Password Login (default) */}
            {!showPhoneLogin && (
              <>
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
              </>
            )}

            {/* Phone Number + OTP Login (hidden by default) */}
            {showPhoneLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={otpSent} // Disable phone number input after OTP is sent
                  />
                </div>
                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {/* reCAPTCHA Challenge */}
            <div className="space-y-2">
              <Label>reCAPTCHA: Enter the code below</Label>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-md font-mono">
                  {recaptchaCode}
                </div>
                <Input
                  type="text"
                  required
                  value={userRecaptchaInput}
                  onChange={(e) => setUserRecaptchaInput(e.target.value)}
                  placeholder="Enter the code"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {showPhoneLogin
                ? (otpSent ? 'Verify OTP' : 'Send OTP')
                : 'Sign in with Email'}
            </Button>
          </CardContent>
        </form>

        {/* Toggle between email/password and phone/OTP login */}
        <CardContent className="text-center">
          <Button variant="link" onClick={toggleLoginMethod}>
            {showPhoneLogin
              ? 'Use Email/Password'
              : 'Use Phone Number/OTP'}
          </Button>
        </CardContent>

        <CardContent className="text-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}