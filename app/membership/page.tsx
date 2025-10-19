"use client"
import Header from "@/components/Header/header"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { Icon } from "@iconify-icon/react"
import Footer from "@/components/Footer/footer"


export default function Membership(){
    const isMobile = useIsMobile()

    return(
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

            <section className="relative flex flex-col items-center justify-center text-white md:h-[40vh] sm:h-[70vh] text-center px-4">
            <div className="absolute inset-0 -z-10">
                <Image
                src="/pic3.png"
                alt="Background"
                fill
                className="object-cover object-center"
                priority
                />
            </div>
    
            <h1 className="text-center font-bold text-2xl py-10 px-5 xl:text-7xl xl:px-80 xl:py-20  text-white">
                <span className="text-amber-400">Discover</span> our <span className="text-amber-400">Featured</span> and 
                <span className="text-amber-400"> Fantastic Promos</span> you may want!
            </h1>
            </section>

            <section className="relative flex flex-col xl:px-50 text-white xl:h-auto sm:h-[90vh] px-4 ">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[#111111]" /> 
                </div>

                <div>
                    <h1 className="font-bold text-3xl xl:text-7xl xl:mt-20 w-full">
                    Featured
                    </h1>

                    <div className="xl:mt-10 grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                </div>

                <div>
                    <h1 className="font-bold text-3xl xl:text-7xl xl:mt-20 w-full">
                    Promos
                    </h1>

                    <div className="xl:mt-10 grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                </div>

                <div className="xl:mb-20">
                    <h1 className="font-bold text-3xl xl:text-7xl xl:mt-20 w-full">
                    Comming Soon...
                    </h1>

                    <div className="xl:mt-10 grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                </div>
            </section>

            <Footer/>

    </div>
    )
}