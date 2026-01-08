"use client"
import React from 'react';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RoleSelection = () => {
  // Navigation handler (Replace with your router logic, e.g., useNavigate from react-router-dom)
  const router = useRouter()
  const handleRedirection = (role:any) => {
    console.log(`Redirecting to ${role} dashboard...`);
    router.push(`frontend/${role}`)
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Branding/Header */}
        <div className="mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Please select your portal to continue</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Admin Button */}
          <button
            onClick={() => handleRedirection('adminUi')}
            className="group w-full flex items-center justify-between p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-lg">Administrator</span>
                <span className="text-sm text-slate-500">Manage products, offers, and settings</span>
              </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
          </button>

          {/* User Button */}
          <button
            onClick={() => handleRedirection('userUi')}
            className="group w-full flex items-center justify-between p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-600 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-lg">Customer Portal</span>
                <span className="text-sm text-slate-500">Browse products and apply offers</span>
              </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-slate-400">
          Secure login system. By entering you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;