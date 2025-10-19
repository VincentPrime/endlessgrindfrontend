"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/adminsidebar/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { AddPackage } from "@/components/adminsModal/addpromo";
import { useEffect, useState } from "react";
import axios from "axios";

interface Package {
  package_id: number;
  title: string;
  description: string;
  price: number;
  picture: string;
}

export default function PackagePage() {
  const isMobile = useIsMobile();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/getpackages");
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/deletepack/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg.package_id !== id));
      alert("✅ Package deleted successfully!");
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("❌ Failed to delete package.");
    }
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      <SidebarInset>
        <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2">PROMOS / PACKAGES</h1>
        <div className="mr-auto xl:ml-4">
          <AddPackage onPackageAdded={fetchPackages} />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-gray-700 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6 overflow-x-auto">
            <table className="w-full text-white border-collapse">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="p-3 border-b border-gray-600">Title</th>
                  <th className="p-3 border-b border-gray-600">Description</th>
                  <th className="p-3 border-b border-gray-600">Price</th>
                  <th className="p-3 border-b border-gray-600">Picture</th>
                  <th className="p-3 border-b border-gray-600 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : packages.length > 0 ? (
                  packages.map((pkg) => (
                    <tr key={pkg.package_id} className="hover:bg-gray-600">
                      <td className="p-3 border-b border-gray-600">{pkg.title}</td>
                      <td className="p-3 border-b border-gray-600">{pkg.description}</td>
                      <td className="p-3 border-b border-gray-600">₱{pkg.price}</td>
                      <td className="p-3 border-b border-gray-600">
                        {pkg.picture ? (
                          <Image
                            src={pkg.picture}
                            alt={pkg.title || "Package image"}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-500 rounded-lg flex items-center justify-center text-sm text-gray-300">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-600 text-center">
                        <button
                          onClick={() => handleDelete(pkg.package_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No packages available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
