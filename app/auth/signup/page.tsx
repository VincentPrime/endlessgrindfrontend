"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { Separator } from "@radix-ui/react-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify-icon/react";
import Swal from "sweetalert2";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        weight: formData.weight || null,
        height: formData.height || null,
      };

      const res = await axios.post("http://localhost:4000/api/auth/signup", payload, {
        withCredentials: true,
      });

      Swal.fire({
        text: "Sign up successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
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
    } catch (err: any) {
      console.error("❌ Signup error:", err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

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
          <Icon icon="ic:round-menu" width="28" height="28" className="text-white" />
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
                <Input name="firstname" placeholder="First Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.firstname} onChange={handleChange} />
                <Input name="middlename" placeholder="Middle Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.middlename} onChange={handleChange} />
                <Input name="lastname" placeholder="Last Name" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.lastname} onChange={handleChange} />
              </div>

              {/* SEX & CIVIL STATUS & DOB */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <select name="sex" className="h-16 bg-white/20 text-black placeholder:text-white border-none rounded-md px-4" value={formData.sex} onChange={handleChange}>
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select name="civil_status" className="h-16 text-black bg-white/20 placeholder:text-white border-none rounded-md px-4" value={formData.civil_status} onChange={handleChange}>
                  <option value="">Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>

                <Input name="date_of_birth" type="date" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.date_of_birth} onChange={handleChange} />
              </div>

              {/* WEIGHT & HEIGHT & ADDRESS */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Input name="weight" type="number" step="0.01" placeholder="Weight (kg)" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.weight} onChange={handleChange} />
                <Input name="height" type="number" step="0.01" placeholder="Height (cm)" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.height} onChange={handleChange} />
                <Input name="address" placeholder="Address" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.address} onChange={handleChange} />
              </div>

              {/* EMAIL & PASSWORD */}
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Input name="email" type="email" placeholder="Email" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.email} onChange={handleChange} />
                <Input name="password" type="password" placeholder="Enter Password" className="h-16 bg-white/20 text-white placeholder:text-white border-none" value={formData.password} onChange={handleChange} />
              </div>

              <div className="w-full">
                <Button type="submit" className="w-full xl:h-13 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
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
                  By creating an account, you agree to Endless Grind{" "}
                  <span className="text-amber-400">Conditions of Use</span> and{" "}
                  <span className="text-amber-400">Privacy Notice.</span>
                </h1>
                <h1>Endless Grind. All Rights Reserved.</h1>
              </div>
            </Card>
          </form>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
