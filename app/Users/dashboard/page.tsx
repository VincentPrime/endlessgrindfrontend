"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/userssidebar/user-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import RouteGuard from "@/components/protectedRoute/protectedRoutes"

export default function Dashboard(){
    const isMobile = useIsMobile()
    return(
        <RouteGuard allowedRoles={["user"]}>
             <SidebarProvider>
            {!isMobile && <UserSidebar />}
            <SidebarInset>
            {isMobile &&  
            <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-11 py-2">
                <div className="flex items-center gap-2 ">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                src={"/icon.png"}
                alt=""
                fill
                className="object-cover"
                />
                </div>
                <div className="flex flex-col font-semibold">
                <h1 className="text-2xl">Endless Grind</h1>
                </div>
                </div>
            </header> 
            }
            <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2 ml-4 mt-2 text-2xl">Dashboard</h1>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
            </SidebarInset>
         </SidebarProvider>
        </RouteGuard>
    )


}