"use client"
import Header from "@/components/Header/header"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { Icon } from "@iconify-icon/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@radix-ui/react-separator"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/AuthContext"
import Footer from "@/components/Footer/footer";

export default function Login() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { setUser } = useUser();
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  

const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const user = response.data.user;

    // ✅ Save user to localStorage for context use
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Redirect based on role
    if (user.role === "admin") {
      router.push("/Admin/dashboard");
    } else if (user.role === "coach") {
      router.push("/Coach/dashboard");
    } else {
      router.push("/Users/dashboard");
    }

    console.log("Login success:", user);
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || "Login failed");
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

      <section className="relative flex flex-col items-center justify-center text-white h-[90vh]">
        <div className="absolute inset-0 -z-10">
          <Image src="/pic4.png" alt="Background" fill className="object-cover object-center" priority />
        </div>

        <Card className="py-10 px-10 shadow-none border-none bg-[#1E1E1E]/80">
          <Card className="flex justify-center bg-transparent items-center gap-10 border-none shadow-none ">
            <div>
              <Image src={"/icon.png"} alt="" width={100} height={100} />
            </div>
            <h1 className="font-bold xl:text-7xl text-4xl text-white ">Log in</h1>
            <div className="md:w-full md:gap-4">
              <Input
                placeholder="Email"
                className="h-16 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="h-16 bg-white mt-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <div className="w-full">
              <Button onClick={handleLogin} className="w-full xl:h-13 bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
              <h1 className="text-white text-center xl:mt-5 mt-2">
                Don't have an account?{" "}
                <Link href={"/auth/signup"} className="text-amber-400">
                  Sign up
                </Link>
              </h1>
            </div>

            <div className="w-full text-center text-[#c7c7c7]">
              <Separator className="bg-[#c7c7c7] h-0.5 w-full" />
              <h1>
                By creating an account, you agree to Endless Grind{" "}
                <span className="text-amber-400">Conditions of Use</span> and
                <span className="text-amber-400"> Privacy Notice.</span>
              </h1>
              <h1>Endless Grind. All Rights Reserved.</h1>
            </div>
          </Card>
        </Card>
      </section>
      <Footer/>
    </div>
  )
}
