"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { Separator } from "@radix-ui/react-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import Swal from "sweetalert2";
import { Sideheader } from "@/components/sideheader/sideheader";
import { Privacy } from "@/components/privacy/privacy";
import { Conditions } from "@/components/privacy/conditions";

interface ErrorResponse {
  message?: string;
}

export default function Signup() {
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    sex: "",
    civil_status: "",
    date_of_birth: "",
    weight: "",
    height: "",
    address: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  
  // 🆕 OTP STATE
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);


  // 🆕 COUNTDOWN TIMER
  useEffect(() => {
    if (showOtpModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtpModal, timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🆕 FORMAT TIME (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 🆕 SEND OTP
  const sendOTP = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/send-otp", { email: formData.email });
      
      Swal.fire({
        text: "OTP sent to your email!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      setTimeLeft(120);
      setCanResend(false);
      setShowOtpModal(true);
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      Swal.fire({
        text: error.response?.data?.message || "Failed to send OTP",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 MODIFIED SIGNUP - NOW SENDS OTP INSTEAD
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstname || !formData.lastname || !formData.sex || 
        !formData.civil_status || !formData.date_of_birth || 
        !formData.email || !formData.password) {
      Swal.fire({
        text: "Please fill all required fields",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    await sendOTP();
  };

  // 🆕 VERIFY OTP AND CREATE ACCOUNT
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Swal.fire({
        text: "Please enter 6-digit OTP",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify OTP
      await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      // Step 2: Create Account
      const payload = {
        ...formData,
        weight: formData.weight || null,
        height: formData.height || null,
      };

      await axios.post("/api/auth/signup-verified", payload, {
        withCredentials: true,
      });

      Swal.fire({
        text: "Account created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        firstname: "",
        middlename: "",
        lastname: "",
        sex: "",
        civil_status: "",
        date_of_birth: "",
        weight: "",
        height: "",
        address: "",
        email: "",
        password: "",
      });
      setOtp("");
      setShowOtpModal(false);
    } catch (err: unknown) {
      console.error("❌ Verification error:", err);
      const error = err as AxiosError<ErrorResponse>;
      Swal.fire({
        text: error.response?.data?.message || "Verification failed",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🆕 RESEND OTP
  const handleResendOTP = async () => {
    await sendOTP();
  };

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
    );
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
          <Sideheader />
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

      <section className="relative flex flex-col items-center justify-center text-white h-auto xl:py-10 py-10 px-5">
        <div className="absolute inset-0 -z-10">
          <Image src="/pic4.png" alt="Background" fill className="object-cover object-center" priority />
        </div>

        <Card className="py-10 px-10 shadow-none border-none bg-[#1E1E1E]/80">
          <form onSubmit={handleSignup}>
            <Card className="flex flex-col items-center gap-6 bg-transparent border-none shadow-none">
              <div>
                <Image src={"/icon.png"} alt="" width={100} height={100} />
              </div>
              <h1 className="font-bold xl:text-7xl text-4xl text-white">Sign Up</h1>

              {/* NAME */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Input name="firstname" placeholder="First Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.firstname} onChange={handleChange} required />
                <Input name="middlename" placeholder="Middle Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.middlename} onChange={handleChange} />
                <Input name="lastname" placeholder="Last Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.lastname} onChange={handleChange} required />
              </div>

              {/* SEX & CIVIL STATUS & DOB */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <select name="sex" className="h-16 bg-white/20 text-black placeholder:text-white border-none rounded-md px-4" value={formData.sex} onChange={handleChange} required>
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select name="civil_status" className="h-16 text-black bg-white/20 placeholder:text-white border-none rounded-md px-4" value={formData.civil_status} onChange={handleChange} required>
                  <option value="">Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>

                <Input name="date_of_birth" type="date" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.date_of_birth} onChange={handleChange} required />
              </div>

              {/* WEIGHT & HEIGHT & ADDRESS */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Input name="weight" type="number" step="0.01" placeholder="Weight (kg)" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.weight} onChange={handleChange} />
                <Input name="height" type="number" step="0.01" placeholder="Height (cm)" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.height} onChange={handleChange} />
                <Input name="address" placeholder="Address" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.address} onChange={handleChange} />
              </div>

              {/* EMAIL & PASSWORD */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Input name="email" type="email" placeholder="Email" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.email} onChange={handleChange} required />
                <Input name="password" type="password" placeholder="Enter Password" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="w-full">
                <Button type="submit" className="w-full xl:h-13 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Sending Verification..." : "Sign Up"}
                </Button>
                <h1 className="text-white text-center xl:mt-5 mt-2">
                  Already have an account?{" "}
                  <Link href={"/auth/login"} className="text-amber-400">
                    Login
                  </Link>
                </h1>
              </div>

              <div className="w-full text-center text-[#c7c7c7]">
                <Separator className="bg-[#c7c7c7] h-0.5 w-full" />
              <h1>
                By creating an account, you agree to Endless Grind
                <span className="inline-flex"><Conditions /></span>and
                <span className="inline-flex"><Privacy /></span>
                <h1>Endless Grind. All Rights Reserved.</h1>
              </h1>

              </div> 
            </Card>
          </form>
        </Card>
      </section>

      <Footer />

      {/* 🆕 OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h2>
              <p className="text-gray-600">Enter the OTP sent to</p>
              <p className="font-semibold text-blue-600">{formData.email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
              <span className={`text-3xl font-mono font-bold ${timeLeft > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
              </span>
              <p className="text-sm text-gray-600 mt-1">Time remaining</p>
            </div>

            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full p-4 text-center text-2xl font-mono border-2 mb-4 tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </Button>

              <Button
                onClick={handleResendOTP}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3"
                disabled={!canResend || loading}
              >
                {canResend ? "Resend OTP" : `Resend in ${formatTime(timeLeft)}`}
              </Button>

              <Button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                className="w-full bg-transparent hover:bg-gray-100 text-gray-600 py-2"
              >
                ← Back to form
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}