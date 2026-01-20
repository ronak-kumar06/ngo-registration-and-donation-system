import React from 'react';
import { Heart, LogOut, User, History } from 'lucide-react';

export default function UserDashboardOptionA() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Heart className="fill-blue-600" /> NGO Connect
        </div>
        <div className="flex gap-4 text-gray-600">
          <button className="flex items-center gap-2 hover:text-blue-600"><User size={18} /> Profile</button>
          <button className="flex items-center gap-2 hover:text-red-600"><LogOut size={18} /> Logout</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 p-6">
        {/* Main Action Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center mb-10 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Make a Difference Today</h1>
          <p className="text-gray-500 mb-8">Your contribution helps us provide education and healthcare.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['₹500', '₹1000', '₹2000', 'Custom'].map((amt) => (
              <button key={amt} className="border-2 border-blue-100 py-3 rounded-xl font-semibold text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all">
                {amt}
              </button>
            ))}
          </div>
          
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Donate Now
          </button>
        </div>

        {/* Recent Activity (Minimal) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <History size={20} /> Recent Contributions
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Education Fund</p>
                <p className="text-sm text-gray-500">20 Jan 2026</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₹1,000</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Success</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg opacity-70">
              <div>
                <p className="font-medium text-gray-800">Healthcare Support</p>
                <p className="text-sm text-gray-500">15 Jan 2026</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-600">₹500</p>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
