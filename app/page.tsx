"use client";

import Image from "next/image";
import Header from "@/components/Header/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify-icon/react";
import Footer from "@/components/Footer/footer";
import { Card } from "@/components/ui/card";
export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
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

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-white h-[80vh] sm:h-[90vh] px-4 text-center">
        <div className="absolute inset-0 -z-10">
                  <Image
                    src="/pic1.png"
                    alt="Background"
                    fill
                    className="object-cover object-center"
                    priority
                    />
          <div className="absolute inset-0 bg-black/60" /> 
        </div>
        <h1 className="font-bold text-3xl xl:text-7xl w-full">
          <span className="text-amber-400">GRIND FIT</span>: LET’S GRIND YOUR BODY
        </h1>
      </section>

      {/* WHY FITNESS SECTION */}
      <section className="relative z-10 flex justify-center bg-[#1E1E1E] text-white py-16 px-6 sm:px-10 md:px-20 lg:px-40">
        <div className="max-w-7xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">
            WHY <span className="text-amber-300">FITNESS</span> IS IMPORTANT?
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10">
        
            <div className="relative w-full md:w-1/2 h-[350px]  md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/pic2.png"
                alt="Fitness"
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-l font-bold md:text-2xl leading-relaxed">
                Being active is good for your brain, helps you stay at a healthy weight,
                lowers the risk of diseases, strengthens your bones and muscles, and
                makes daily tasks easier. Adults can benefit from any amount of
                moderate-to-vigorous exercise, especially if they sit less.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR BODY SECTION */}
      <section className="relative flex flex-col items-center justify-center text-white h-[60vh] sm:h-[70vh] text-center px-4">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/pic3.png"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-snug">
          Your <span className="text-amber-400">body</span> can do it
        </h1>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-snug">
          It’s time to convince your <span className="text-amber-400">mind.</span>
        </h1>
      </section>

      {/* OUR MEMBESHIP */}
      <section className="relative z-10 flex justify-center bg-[#1E1E1E] text-white py-16 px-6 sm:px-10 md:px-20 lg:px-40">
        <div className="max-w-7xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">
            OUR <span className="text-amber-300">MEMBERSHIP</span>
          </h2>

          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>

        </div>
      </section>

      {/* LOCATION */}
      <section className="relative flex flex-col xl:px-80 items-center justify-center text-white h-[80vh] sm:h-[90vh] px-4 text-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/pic7.png"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
          />
            <div className="absolute inset-0 bg-black/60" /> 
        </div>
        <h1 className="font-bold text-3xl xl:text-7xl w-full">
          <Card>
            
          </Card>
        </h1>
      </section>


      <Footer/>
    </div>
  );
}