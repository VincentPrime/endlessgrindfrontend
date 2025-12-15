"use client"

import { useState,useEffect } from "react";
import Image from "next/image"
import { Icon } from "@iconify-icon/react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/userssidebar/user-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Usermobilesidebar } from '@/components/userssidebar/usermobilesidebar';
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Coach {
  coach_id: number
  coach_name: string
  email: string
  bio: string | null
  profile_image: string | null
  specialty: string | null
  certifications: string | null
  years_of_experience: number
  availability: string | null
  performance_rating: number
  total_clients_trained: number
  is_active: boolean
}



export default function Sales(){
    const isMobile = useIsMobile();
    const [coaches, setCoaches] = useState<Coach[]>([])
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
      const fetchCoaches = async () => {
        try {
          const response = await axios.get("/api/coaches/all", {
            withCredentials: true
          })
          if (response.data.success) {
            setCoaches(response.data.coaches)
          }
        } catch (error) {
          console.error("Error fetching coaches:", error)
        } finally {
          setLoading(false)
        }
      }

    fetchCoaches()
    }, [])

    const handleCoachClick = (coach: Coach) => {
      setSelectedCoach(coach)
      setIsDialogOpen(true)
    }

    return(
        <SidebarProvider>
            {!isMobile && <UserSidebar />}
            <SidebarInset>
                {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
            <Usermobilesidebar/>
          </header>
        )}

        <div>
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Training Schedule</h1>
                <p className="text-gray-600">View your program, book sessions, and track progress</p>
            </div>

            <div className="container mx-auto">
                {loading ? (
                <div className="text-center py-10">
                    <p className="text-xl">Loading coaches...</p>
                </div>
                ) : coaches.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl">No coaches available yet.</p>
                </div>
                ) : (
                <div className="xl:mt-10 xl:mb-20 grid auto-rows-min gap-8 md:grid-cols-3 sm:grid-cols-2">
                    {coaches.map((coach) => (
                    <div 
                        key={coach.coach_id}
                        onClick={() => handleCoachClick(coach)}
                        className="flex flex-col items-center gap-4 cursor-pointer group"
                    >
                        {/* Avatar with hover effect */}
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-amber-400/50">
                        {coach.profile_image ? (
                            <Image
                            src={coach.profile_image}
                            alt={coach.coach_name}
                            fill
                            className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white">
                                {coach.coach_name.charAt(0).toUpperCase()}
                            </span>
                            </div>
                        )}
                        </div>

                        {/* Coach Info */}
                        <div className="text-center">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                            {coach.coach_name}
                        </h3>
                        {coach.specialty && (
                            <p className="text-sm text-gray-400 mt-1">{coach.specialty}</p>
                        )}
                        {coach.performance_rating > 0 && (
                            <div className="flex items-center justify-center gap-1 mt-2">
                            <Icon icon="mdi:star" className="text-amber-400" width="20" />
                            <span className="text-amber-400 font-semibold">{coach.performance_rating}</span>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto bg-[#1a1a1a] text-white border-amber-400">
                {selectedCoach && (
                    <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-amber-400">
                        Coach Details
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 mt-4">
                        {/* Profile Image */}
                        <div className="flex justify-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-amber-400">
                            {selectedCoach.profile_image ? (
                            <Image
                                src={selectedCoach.profile_image}
                                alt={selectedCoach.coach_name}
                                fill
                                className="object-cover"
                            />
                            ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                <span className="text-8xl font-bold text-white">
                                {selectedCoach.coach_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            )}
                        </div>
                        </div>

                        {/* Coach Info */}
                        <div className="space-y-4">
                        <div>
                            <h3 className="text-3xl font-bold text-center">{selectedCoach.coach_name}</h3>
                            {selectedCoach.specialty && (
                            <p className="text-center text-amber-400 text-lg mt-1">{selectedCoach.specialty}</p>
                            )}
                        </div>

                        {selectedCoach.bio && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-2">Bio</h4>
                            <p className="text-gray-300">{selectedCoach.bio}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {selectedCoach.years_of_experience > 0 && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                                <h4 className="font-semibold text-amber-400 mb-1">Experience</h4>
                                <p className="text-gray-300">{selectedCoach.years_of_experience} years</p>
                            </div>
                            )}

                            {selectedCoach.performance_rating > 0 && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                                <h4 className="font-semibold text-amber-400 mb-1">Rating</h4>
                                <div className="flex items-center gap-2">
                                <Icon icon="mdi:star" className="text-amber-400" width="24" />
                                <span className="text-gray-300 text-lg">{selectedCoach.performance_rating}</span>
                                </div>
                            </div>
                            )}

                            {selectedCoach.total_clients_trained > 0 && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                                <h4 className="font-semibold text-amber-400 mb-1">Clients Trained</h4>
                                <p className="text-gray-300">{selectedCoach.total_clients_trained}</p>
                            </div>
                            )}

                            {selectedCoach.availability && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                                <h4 className="font-semibold text-amber-400 mb-1">Availability</h4>
                                <p className="text-gray-300">{selectedCoach.availability}</p>
                            </div>
                            )}
                        </div>

                        {selectedCoach.certifications && (
                            <div className="bg-[#2a2a2a] p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-2">Certifications</h4>
                            <p className="text-gray-300">{selectedCoach.certifications}</p>
                            </div>
                        )}

                        <div className="bg-[#2a2a2a] p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-400 mb-1">Contact</h4>
                            <p className="text-gray-300">{selectedCoach.email}</p>
                        </div>
                        </div>
                    </div>
                    </>
                )}
                </DialogContent>
            </Dialog>

        </div>
            </SidebarInset>
        </SidebarProvider>
    )
}