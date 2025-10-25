"use client";

import Image from "next/image";
import Header from "@/components/Header/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify-icon/react";
import Footer from "@/components/Footer/footer";
import { Card } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sideheader } from "@/components/sideheader/sideheader";

// Dynamically import the map component (client-side only)
const GymMap = dynamic(() => import('@/components/gymmap/GymMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Package {
  package_id: number
  title: string
  description: string
  picture: string
  price: number
  created_at: string
}

export default function Home() {
  const isMobile = useIsMobile();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/getpackages');
      if (response.ok) {
        const data = await response.json();
        // Limit to 3 packages for home page
        setPackages(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
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
  )
}

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
          <span className="text-amber-400">GRIND FIT</span>: LET&apos;S GRIND YOUR BODY
        </h1>
      </section>

      {/* WHY FITNESS SECTION */}
      <section className="relative z-10 flex justify-center bg-[#1E1E1E] text-white py-16 px-6 sm:px-10 md:px-20 lg:px-40">
        <div className="max-w-7xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">
            WHY <span className="text-amber-300">FITNESS</span> IS IMPORTANT?
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-full md:w-1/2 h-[350px] md:h-[400px] rounded-lg overflow-hidden">
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
          It&apos;s time to convince your <span className="text-amber-400">mind.</span>
        </h1>
      </section>

      {/* OUR MEMBERSHIP */}
      <section className="relative z-10 flex justify-center bg-[#1E1E1E] text-white py-16 px-6 sm:px-10 md:px-20 lg:px-40">
        <div className="max-w-7xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">
            OUR <span className="text-amber-300">MEMBERSHIP</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-xl text-gray-400">Loading packages...</div>
            </div>
          ) : packages.length === 0 ? (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
          ) : (
            <>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.package_id} 
                    className="bg-zinc-900 border-zinc-800 overflow-hidden"
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
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{pkg.description}</p>
                      <div className="text-amber-400 font-bold text-lg">₱{pkg.price.toLocaleString()}</div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link href="/membership">
                  <button className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                    View All
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* LOCATION SECTION WITH MAP */}
    <section className="relative flex flex-col items-center justify-center text-white py-16 px-6 sm:px-10 md:px-20 lg:px-40">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/pic7.png"
          alt="Location Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
          FIND <span className="text-amber-300">OUR LOCATION</span>
        </h2>

        {/* Map Card */}
        <Card className="w-full h-[500px] lg:h-[600px] overflow-hidden border-4 border-amber-500/20 bg-black/30 backdrop-blur-sm">
          <GymMap className="w-full h-full" />
        </Card>

        {/* Additional info below map */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-black/70 backdrop-blur-sm border-amber-500/30">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:map-marker" className="text-amber-400 text-3xl flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Address</h3>
                <p className="text-sm text-gray-300">
                  9015 @ Gen. Emilio Aguinaldo Highway<br />
                  Arcontica Subdivision Salitran 2<br />
                  Dasmariñas, Philippines
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/70 backdrop-blur-sm border-amber-500/30">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:clock-outline" className="text-amber-400 text-3xl flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Opening Hours</h3>
                <p className="text-sm text-gray-300">
                  Monday - Friday: 5:00 AM - 10:00 PM<br />
                  Saturday - Sunday: 6:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/70 backdrop-blur-sm border-amber-500/30">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:phone" className="text-amber-400 text-3xl flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Contact Us</h3>
                <p className="text-sm text-gray-300">
                  Phone: +63 976 044 3407<br />
                  Email: endlessgrindfitnesscenter@gmail.com
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

      <Footer />
    </div>
  );
}