"use client"
import Header from "@/components/Header/header"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { Icon } from "@iconify-icon/react"
import Footer from "@/components/Footer/footer"
import { useEffect, useState, useRef } from "react"

interface Package {
  package_id: number
  title: string
  description: string
  picture: string
  price: number
  created_at: string
}

export default function Membership(){
    const isMobile = useIsMobile()
    const [packages, setPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(true)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      fetchPackages()
    }, [])

    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getpackages')
        if (response.ok) {
          const data = await response.json()
          setPackages(data)
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const cardWidth = scrollContainerRef.current.querySelector('.package-card')?.clientWidth || 0
        const gap = 16 // gap-4 = 16px
        const scrollAmount = cardWidth + gap
        
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        })
      }
    }

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
                <span className="text-amber-400"> Fantastic Packages</span> you may want!
            </h1>
            </section>

            <section className="relative flex flex-col xl:px-50 text-white xl:h-auto sm:h-[90vh] px-4 ">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[#111111]" /> 
                </div>

                <div className="xl:mt-10 mt-10 xl:mb-40">
                    <h1 className="font-bold text-3xl xl:text-7xl xl:mt-20 w-full mb-5">
                    Packages
                    </h1>

                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-xl text-gray-400">Loading packages...</div>
                      </div>
                    ) : packages.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-xl text-gray-400">No packages available</div>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Navigation buttons */}
                        {packages.length > 1 && (
                          <>
                            <button 
                              onClick={() => scroll('left')}
                              className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 md:p-3 rounded-full transition-colors"
                            >
                              <Icon icon="mdi:chevron-left" width="24" height="24" />
                            </button>
                            
                            <button 
                              onClick={() => scroll('right')}
                              className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 md:p-3 rounded-full transition-colors"
                            >
                              <Icon icon="mdi:chevron-right" width="24" height="24" />
                            </button>
                          </>
                        )}
                        
                        {/* Scrollable container */}
                        <div 
                          ref={scrollContainerRef}
                          className="xl:mt-10 flex gap-20 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-10 md:px-12"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {packages.map((pkg) => (
                            <Card 
                              key={pkg.package_id} 
                              className="package-card bg-zinc-900 border-zinc-800 overflow-hidden flex-shrink-0 w-[calc(100%-5rem)] sm:w-[calc(100%-6rem)] md:w-[calc(33.333%-1rem)] snap-center"
                            >
                              <div className="relative aspect-video">
                                <Image 
                                  src={pkg.picture} 
                                  alt={pkg.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                                <p className="text-gray-400 text-sm mb-3">{pkg.description}</p>
                                <div className="text-amber-400 font-bold text-lg">₱{pkg.price.toLocaleString()}</div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Dots indicator for mobile */}
                        {packages.length > 1 && (
                          <div className="flex justify-center gap-2 mt-4 md:hidden">
                            {packages.map((_, index) => (
                              <div 
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-600"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>

            </section>

            <Footer/>

    </div>
    )
}