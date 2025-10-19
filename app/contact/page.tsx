"use client"
import Image from "next/image";
import Header from "@/components/Header/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import { Icon } from "@iconify-icon/react"
import Footer from "@/components/Footer/footer";
export default function Contact(){
     const isMobile = useIsMobile()
    return(
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
                        {/* Background */}
                        <div className="absolute inset-0 -z-10">
                            <Image
                            src="/pic4.png"
                            alt="Background"
                            fill
                            className="object-cover object-center"
                            priority
                            />
                        </div>
            
                        {/* Content on top of background */}
                <Card className=" xl:py-10 xl:px-10 shadow-none border-none bg-[#1E1E1E]">
                    <Card className="flex justify-center bg-transparent items-center gap-10 border-none shadow-none ">
                        <div className="flex items-center gap-2" >
                            <Image
                            src={"/icon.png"}
                            alt=""
                            width={100}
                            height={100}
                            />
                           <h1 className="font-bold xl:text-7xl text-4xl text-white ">Contact Us!</h1>
                        </div>
                        <div className="md:flex md:w-full md:gap-4 flex-row ">
                            <Input placeholder="Name" className="h-16 bg-white "/>
                            <Input placeholder="Email" className="h-16 bg-white md:mt-0 mt-4"/>
                        </div>

                        <Textarea placeholder="Enter your Concern"  className="bg-white h-50"/>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Send</Button>

                    </Card>
                </Card>
            </section>

            <Footer/>
        </div>
    )
}