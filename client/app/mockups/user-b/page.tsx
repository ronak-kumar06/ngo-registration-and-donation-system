import React from 'react';
import { LayoutDashboard, History, Settings, LifeBuoy, Download, CheckCircle, Clock, XCircle, Heart } from 'lucide-react';

export default function UserDashboardOptionB() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      {/* Sidebar - Refined with softer dark tones and gradient accents */}
      <aside className="w-64 bg-[#1a2332] text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Heart className="text-white fill-white" size={20} />
          </div>
          <span className="text-white text-lg font-bold tracking-wide">HopeConnect</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-2">Menu</p>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:translate-x-1">
            <LayoutDashboard size={20} /> 
            <span className="font-medium">Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all group">
            <History size={20} className="group-hover:text-indigo-400 transition-colors" /> 
            <span>Donation History</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all group">
            <Settings size={20} className="group-hover:text-indigo-400 transition-colors" /> 
            <span>Settings</span>
          </a>
        </nav>
        
        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
             <p className="text-xs text-slate-400 mb-2">Logged in as</p>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">RJ</div>
                <p className="text-sm font-medium text-white">Ronak J.</p>
             </div>
          </div>
          <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white transition-colors text-sm text-slate-500">
            <LifeBuoy size={16} /> Help & Support
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Ronak! 👋</h1>
            <p className="text-slate-500">Your generosity is changing lives. Here&apos;s your impact overview.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                View Profile
             </button>
             <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                <Heart size={18} className="fill-indigo-400 text-indigo-400" /> New Donation
             </button>
          </div>
        </header>

        {/* Stats Cards - Refined Typography and Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <LayoutDashboard size={24} />
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Donated</p>
            <h3 className="text-3xl font-bold text-slate-800">₹12,500</h3>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-emerald-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Heart size={24} />
                </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Campaigns Supported</p>
            <h3 className="text-3xl font-bold text-slate-800">8</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-orange-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Clock size={24} />
                </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Last Donation</p>
            <h3 className="text-3xl font-bold text-slate-800">2 days ago</h3>
          </div>
        </div>

        {/* Detailed History Table - Cleaner Look */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-slate-800">Recent Contributions</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center gap-2 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                <Download size={16} /> Download All Receipts
            </button>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Campaign</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-8 py-5 font-mono text-xs text-slate-400">#DON-8291</td>
                <td className="px-8 py-5 font-medium text-slate-700">Winter Relief Fund</td>
                <td className="px-8 py-5 text-slate-500">20 Jan 2026</td>
                <td className="px-8 py-5 font-bold text-slate-800">₹2,000</td>
                <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                        <CheckCircle size={12} className="fill-emerald-200" /> Success
                    </span>
                </td>
                <td className="px-8 py-5 text-right"><button className="text-slate-400 hover:text-indigo-600 transition-colors"><Download size={18}/></button></td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-8 py-5 font-mono text-xs text-slate-400">#DON-8292</td>
                <td className="px-8 py-5 font-medium text-slate-700">Child Education</td>
                <td className="px-8 py-5 text-slate-500">18 Jan 2026</td>
                <td className="px-8 py-5 font-bold text-slate-800">₹1,500</td>
                <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium border border-amber-100">
                        <Clock size={12} className="fill-amber-200" /> Pending
                    </span>
                </td>
                <td className="px-8 py-5 text-right"><button className="text-slate-300 cursor-not-allowed"><Download size={18}/></button></td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-8 py-5 font-mono text-xs text-slate-400">#DON-8288</td>
                <td className="px-8 py-5 font-medium text-slate-700">General Fund</td>
                <td className="px-8 py-5 text-slate-500">10 Jan 2026</td>
                <td className="px-8 py-5 font-bold text-slate-800">₹500</td>
                <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs font-medium border border-rose-100">
                        <XCircle size={12} className="fill-rose-200" /> Failed
                    </span>
                </td>
                <td className="px-8 py-5 text-right"><button className="text-indigo-600 text-xs font-semibold hover:underline">Retry Payment</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
