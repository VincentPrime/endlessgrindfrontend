"use client"
import Header from "@/components/Header/header"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/Footer/footer"
import { Sideheader } from "@/components/sideheader/sideheader"
import Swal from "sweetalert2"

interface ErrorResponse {
  message?: string;
}

type Step = 'email' | 'otp' | 'reset'

export default function ForgotPassword() {
  const isMobile = useIsMobile()
  const router = useRouter()
  
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (step === 'otp') {
      setCanResend(true)
    }
  }, [countdown, step])

  // Step 1: Check email and send OTP
  const handleCheckEmail = async () => {
    if (!email) {
      Swal.fire({ text: "Please enter your email", icon: "warning", timer: 2000, showConfirmButton: false })
      return
    }
    setLoading(true)
    try {
      // Check if email exists
      const checkRes = await axios.post("/api/auth/forgot-password/check-email", { email })
      
      if (checkRes.data.exists) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const otpRes = await axios.post("/api/auth/forgot-password/send-otp", { email })
        Swal.fire({ title: "OTP Sent!", text: "Check your email for the verification code", icon: "success", timer: 2500, showConfirmButton: false })
        setStep('otp')
        setCountdown(300) // 5 minutes
        setCanResend(false)
      }
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>
      Swal.fire({ text: error.response?.data?.message || "Email not found", icon: "error", timer: 2500, showConfirmButton: false })
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true)
    try {
      await axios.post("/api/auth/forgot-password/send-otp", { email })
      Swal.fire({ text: "New OTP sent to your email", icon: "success", timer: 2000, showConfirmButton: false })
      setCountdown(300)
      setCanResend(false)
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>
      Swal.fire({ text: error.response?.data?.message || "Failed to resend OTP", icon: "error", timer: 2000, showConfirmButton: false })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Swal.fire({ text: "Please enter a valid 6-digit OTP", icon: "warning", timer: 2000, showConfirmButton: false })
      return
    }
    setLoading(true)
    try {
      const res = await axios.post("/api/auth/forgot-password/verify-otp", { email, otp })
      setResetToken(res.data.resetToken)
      Swal.fire({ title: "Verified!", text: "You can now reset your password", icon: "success", timer: 2000, showConfirmButton: false })
      setStep('reset')
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>
      Swal.fire({ text: error.response?.data?.message || "Invalid OTP", icon: "error", timer: 2000, showConfirmButton: false })
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire({ text: "Please fill in both password fields", icon: "warning", timer: 2000, showConfirmButton: false })
      return
    }
    if (newPassword.length < 6) {
      Swal.fire({ text: "Password must be at least 6 characters", icon: "warning", timer: 2000, showConfirmButton: false })
      return
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ text: "Passwords do not match", icon: "error", timer: 2000, showConfirmButton: false })
      return
    }
    setLoading(true)
    try {
      await axios.post("/api/auth/forgot-password/reset-password", { email, resetToken, newPassword })
      Swal.fire({ title: "Success!", text: "Your password has been reset. Please login with your new password.", icon: "success", showConfirmButton: true }).then(() => {
        router.push("/auth/login")
      })
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>
      Swal.fire({ text: error.response?.data?.message || "Failed to reset password", icon: "error", timer: 2500, showConfirmButton: false })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') handleCheckEmail()
      else if (step === 'otp') handleVerifyOTP()
      else if (step === 'reset') handleResetPassword()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isMobile === undefined) {
    return (
      <header className="sticky top-0 z-50 bg-black flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image src="/icon.png" alt="Logo" fill className="object-cover" />
          </div>
          <h1 className="text-lg text-white font-bold">Endless Grind</h1>
        </div>
      </header>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <header className="sticky top-0 z-50 bg-black flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src="/icon.png" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="text-lg text-white font-bold">Endless Grind</h1>
          </div>
          <Sideheader/>
        </header>
      ) : (
        <header className="flex items-center justify-evenly bg-black py-2 px-4 z-20 relative">
          <div className="flex items-center">
            <div className="relative h-20 w-20">
              <Image src="/icon.png" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="text-[#dedede] font-bold text-3xl">Endless Grind</h1>
          </div>
          <Header />
        </header>
      )}

      <section className="relative flex flex-col items-center justify-center text-white h-[90vh] px-5">
        <div className="absolute inset-0 -z-10">
          <Image src="/pic4.png" alt="Background" fill className="object-cover object-center" priority />
        </div>

        <Card className="py-10 px-10 shadow-none border-none bg-[#1E1E1E]/80 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <Image src="/icon.png" alt="" width={80} height={80} />
            <h1 className="font-bold text-3xl md:text-4xl text-white text-center">
              {step === 'email' && "Forgot Password"}
              {step === 'otp' && "Verify OTP"}
              {step === 'reset' && "Reset Password"}
            </h1>
            <p className="text-gray-300 text-center text-sm">
              {step === 'email' && "Enter your email address to receive a verification code"}
              {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
              {step === 'reset' && "Create your new password"}
            </p>

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <div className="w-full space-y-4">
                <Input placeholder="Enter your email" type="email" className="h-14 bg-white/20 text-white placeholder:text-gray-300" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeyPress} disabled={loading} />
                <Button onClick={handleCheckEmail} className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Checking..." : "Send Verification Code"}
                </Button>
              </div>
            )}

            {/* Step 2: OTP Input */}
            {step === 'otp' && (
              <div className="w-full space-y-4">
                <Input placeholder="Enter 6-digit OTP" type="text" maxLength={6} className="h-14 bg-white/20 text-white placeholder:text-gray-300 text-center text-2xl tracking-widest" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} onKeyPress={handleKeyPress} disabled={loading} />
                {countdown > 0 && (
                  <p className="text-center text-amber-400">Code expires in: {formatTime(countdown)}</p>
                )}
                <Button onClick={handleVerifyOTP} className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button variant="ghost" onClick={handleResendOTP} className="w-full text-amber-400 hover:text-amber-300" disabled={loading || !canResend}>
                  {canResend ? "Resend Code" : `Resend available in ${formatTime(countdown)}`}
                </Button>
                <Button variant="ghost" onClick={() => setStep('email')} className="w-full text-gray-400 hover:text-white">
                  ← Change Email
                </Button>
              </div>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <div className="w-full space-y-4">
                <Input placeholder="New Password" type="password" className="h-14 bg-white/20 text-white placeholder:text-gray-300" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onKeyPress={handleKeyPress} disabled={loading} />
                <Input placeholder="Confirm New Password" type="password" className="h-14 bg-white/20 text-white placeholder:text-gray-300" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyPress={handleKeyPress} disabled={loading} />
                <Button onClick={handleResetPassword} className="w-full h-12 bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            )}

            <Link href="/auth/login" className="text-amber-400 hover:underline text-sm">
              ← Back to Login
            </Link>
          </div>
        </Card>
      </section>
      <Footer/>
    </div>
  )
}