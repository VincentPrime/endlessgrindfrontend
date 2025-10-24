"use client";
import Image from "next/image";
import Header from "@/components/Header/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify-icon/react";
import Footer from "@/components/Footer/footer";
import emailjs from "emailjs-com";
import { useState } from "react";
import { Sideheader } from "@/components/sideheader/sideheader";
export default function Contact() {
  const isMobile = useIsMobile();

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    if (!serviceID || !templateID || !publicKey) {
      alert('❌ Email service configuration is missing.');
      setLoading(false);
      return;
    }

    emailjs
      .send(
        serviceID,
        templateID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        publicKey
      )
      .then(() => {
        alert("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("❌ Failed to send message. Please try again later.");
      })
      .finally(() => setLoading(false));
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

      {/* Contact Section */}
      <section className="relative flex flex-col items-center justify-center text-white h-[90vh] px-5">
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

        {/* Form */}
        <Card className="xl:py-10 xl:px-10 shadow-none border-none bg-[#1E1E1E]/70 px-5">
          <Card className="flex justify-center bg-transparent items-center gap-10 border-none shadow-none">
            <div className="flex items-center gap-2">
              <Image src={"/icon.png"} alt="" width={100} height={100} />
              <h1 className="font-bold xl:text-7xl text-4xl text-white">
                Contact Us!
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full md:w-[500px]"
            >
              <Input
                name="name"
                placeholder="Name"
                className="h-16 bg-white"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="h-16 bg-white"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Enter your Concern"
                className="bg-white h-32"
                value={form.message}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </form>
          </Card>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
