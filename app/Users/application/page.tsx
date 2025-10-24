"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/userssidebar/user-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Usermobilesidebar } from "@/components/userssidebar/usermobilesidebar"

interface Package {
  package_id: number;
  title: string;
  description: string;
  price: number;
}

interface Coach {
  coach_id: number;
  coach_name: string;
  specialty: string;
  bio: string;
  years_of_experience: number;
}

export default function ApplicationForm(){
    const isMobile = useIsMobile()
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [hasExistingApplication, setHasExistingApplication] = useState(false);
    const [existingAppStatus, setExistingAppStatus] = useState('');
    const [applicationId, setApplicationId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
      name: '',
      nickname: '',
      sex: '',
      age: '',
      date_of_birth: '',
      email: '',
      facebook: '',
      address: '',
      goal: '',
      weight: '',
      height: '',
      package_id: '',
      coach_id: '',
      waiver_accepted: false,
      payment_method: ''
    });
  
    useEffect(() => {
      fetchPackagesAndCoaches();
      checkExistingApplication();
    }, []);

    const checkExistingApplication = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/applications/my-application', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.application) {
            setHasExistingApplication(true);
            setExistingAppStatus(data.application.application_status);
            setApplicationId(data.application.application_id);
          }
        }
      } catch (error) {
        console.error('Error checking existing application:', error);
      }
    };

    const handleCancelApplication = async () => {
      if (!applicationId) return;

      const confirmCancel = window.confirm(
        'Are you sure you want to cancel your application? This action cannot be undone.'
      );

      if (!confirmCancel) return;

      setCancelLoading(true);

      try {
        const response = await fetch(`http://localhost:4000/api/applications/cancel/${applicationId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          alert('Application cancelled successfully');
          // Refresh the page to show the form again
          window.location.reload();
        } else {
          alert(data.message || 'Failed to cancel application');
        }
      } catch (error) {
        console.error('Error cancelling application:', error);
        alert('Failed to cancel application');
      } finally {
        setCancelLoading(false);
      }
    };
  
    const fetchPackagesAndCoaches = async () => {
      try {
        const [packagesRes, coachesRes] = await Promise.all([
          fetch('http://localhost:4000/api/getpackages', { credentials: 'include' }),
          fetch('http://localhost:4000/api/coaches/all', { credentials: 'include' })
        ]);

        const packagesData = await packagesRes.json();
        const coachesData = await coachesRes.json();

        if (Array.isArray(packagesData)) setPackages(packagesData);
        else if (packagesData.success) setPackages(packagesData.packages);

        if (coachesData.success) setCoaches(coachesData.coaches);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.waiver_accepted) {
        alert('Please accept the waiver to continue');
        return;
      }
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:4000/api/applications/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (data.success) {
          if (data.payment_url) {
            alert(`Application submitted! Opening payment page (₱${data.amount})`);
            // Open payment in new tab
            window.open(data.payment_url, '_blank');
            // Refresh current page to show pending status
            window.location.reload();
          } else {
            alert('Application submitted successfully! Please wait for admin approval.');
            router.push('/user/dashboard');
          }
        } else {
          alert(data.message || 'Failed to submit application');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit application');
      } finally {
        setLoading(false);
      }
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    // If user already has a pending/approved application
    if (hasExistingApplication) {
      return (
        <SidebarProvider>
          {!isMobile && <UserSidebar />}
          <SidebarInset>
            {isMobile && (
              <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
              <Usermobilesidebar/>
              </header>
            )}
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-4">
                  {existingAppStatus === 'pending' && (
                    <>
                      <div className="text-6xl mb-4">⏳</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Pending</h2>
                      <p className="text-gray-600 mb-4">
                        Your application is currently under review by our admin team. 
                        Please check back later for updates.
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        If you've completed payment and want to cancel, you can request a refund.
                      </p>
                    </>
                  )}
                  {existingAppStatus === 'approved' && (
                    <>
                      <div className="text-6xl mb-4">✅</div>
                      <h2 className="text-2xl font-bold text-green-600 mb-2">Application Approved!</h2>
                      <p className="text-gray-600">
                        Your membership has been approved. Welcome to Endless Grind!
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={handleCancelApplication}
                  disabled={cancelLoading || existingAppStatus === 'approved'}
                  className={`w-full py-3 px-6 rounded-md font-bold transition-colors ${
                    existingAppStatus === 'approved'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {cancelLoading ? 'Cancelling...' : existingAppStatus === 'approved' ? 'Cannot Cancel Approved Application' : 'Cancel Application'}
                </button>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      );
    }

    return(
      <SidebarProvider>
        {!isMobile && <UserSidebar />}
        <SidebarInset>
          {isMobile && (
            <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-11 py-2">
              <div className="flex items-center gap-2">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image src="/icon.png" alt="" fill className="object-cover" />
                </div>
                <div className="flex flex-col font-semibold">
                  <h1 className="text-2xl">Endless Grind</h1>
                </div>
              </div>
            </header>
          )}
          
          <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2 ml-4 mt-2 text-2xl">Application</h1>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Membership Application
                </h1>
                <p className="text-gray-600 mb-6">
                  Please fill out this form to apply for gym membership
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nickname
                        </label>
                        <input
                          type="text"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sex *
                        </label>
                        <select
                          name="sex"
                          required
                          value={formData.sex}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          required
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          value={formData.age}
                          onChange={handleChange}
                          min="1"
                          max="120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook Profile
                        </label>
                        <input
                          type="text"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          placeholder="facebook.com/yourprofile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          step="0.01"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          name="height"
                          step="0.01"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fitness Goal *
                        </label>
                        <textarea
                          name="goal"
                          rows={3}
                          required
                          value={formData.goal}
                          onChange={handleChange}
                          placeholder="What do you want to achieve?"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Package Selection */}
             <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Select Package *</h2>

              <div className="w-full">
                <select
                  name="package_id"
                  value={formData.package_id}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">-- Select a Package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.package_id} value={pkg.package_id}>
                      {pkg.title} — ₱{pkg.price}
                    </option>
                  ))}
                </select>

                {formData.package_id && (
                  <div className="mt-4 border border-blue-200 bg-blue-50 p-4 rounded-lg">
                    {(() => {
                      const selected = packages.find(
                        (pkg) => String(pkg.package_id) === String(formData.package_id)
                      );
                      return (
                        selected && (
                          <>
                            <p className="font-semibold text-lg">{selected.title}</p>
                            <p className="text-sm text-gray-600">{selected.description}</p>
                            <p className="text-green-600 font-bold mt-2">₱{selected.price}</p>
                          </>
                        )
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>


                  {/* Coach Selection */}
           <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Coach *</h2>

            <div className="w-full ">
              <select
                name="coach_id"
                value={formData.coach_id}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="">-- Select a Coach --</option>
                {coaches.map((coach) => (
                  <option key={coach.coach_id} value={coach.coach_id}>
                    {coach.coach_name} — {coach.specialty}
                  </option>
                ))}
              </select>

              {formData.coach_id && (
                <div className="mt-4 border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  {(() => {
                    const selected = coaches.find(
                      (coach) => String(coach.coach_id) === String(formData.coach_id)
                    );
                    return (
                      selected && (
                        <>
                          <p className="font-semibold text-lg">{selected.coach_name}</p>
                          <p className="text-sm text-blue-600">{selected.specialty}</p>
                          <p className="text-sm text-gray-600 mt-1">{selected.bio}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selected.years_of_experience} years of experience
                          </p>
                        </>
                      )
                    );
                  })()}
                </div>
              )}
            </div>
          </div>


                  {/* Waiver */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="waiver_accepted"
                        checked={formData.waiver_accepted}
                        onChange={handleChange}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I accept the waiver and understand the risks associated with physical training.
                        I confirm that all information provided is accurate. *
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-500 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? 'Processing...' : 'Submit & Proceed to Payment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
}