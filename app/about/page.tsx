"use client"
import Header from "@/components/Header/header"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import Footer from "@/components/Footer/footer"
import { Sideheader } from "@/components/sideheader/sideheader";



export default function About() {
  const isMobile = useIsMobile()

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
      {/* Header */}
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

          <section className="relative flex flex-col items-center justify-center text-white min-h-[90vh] py-12">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/pic4.png"
            alt="Background"
            fill
            className="object-cover object-center w-full h-full"
          />
        </div>

        {/* Main Content */}
        <Card className="w-full py-10 px-6 md:px-12 xl:px-24 shadow-none border-none bg-[#1E1E1E]/80 backdrop-blur-sm rounded-none">
          <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Profile Image Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                {/* CEO Label */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-6">CEO</h2>
                
                {/* Circular Profile Image */}
                <div className="relative w-64 h-64 rounded-full overflow-hidden mb-6 border-4 border-white/10">
                  <Image
                    src="/pic5.png"
                    alt="CEO"
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* Name */}
                <h3 className="text-2xl md:text-3xl font-semibold text-white">
                  Arisan E. Felix
                </h3>
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 text-center md:text-left space-y-6 text-white">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                Welcome to Grind Fit, your ultimate companion on the journey to peak
                athletic performance. Designed for Endless Grind Fitness, our
                mission is to help athletes of all levels unlock their full
                potential through customized training programs, smart performance
                tracking, and expert coaching.
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                At Grind Fit, we believe that success is built on consistency,
                determination, and the right support system. Our interactive
                platform empowers members to effortlessly manage their workout
                plans, monitor progress, set personalized goals, and schedule
                sessions with professional coaches — all in one place.
              </p>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                Join us today and take your fitness journey to the next level.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Footer/>

    </div>
  )
}
