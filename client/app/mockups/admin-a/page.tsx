import React from 'react';
import { Users, DollarSign, AlertCircle, TrendingUp, PieChart, Download, Calendar, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardOptionA() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8 lg:p-10 text-slate-800">
      <header className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
            <p className="text-slate-500">Overview of NGO performance and donations.</p>
        </div>
        <div className="flex gap-4 items-center">
             <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <span className="text-sm font-medium text-slate-600">Jan 2026</span>
             </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-medium">
                <Download size={18} /> Export Report
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white ml-2">A</div>
        </div>
      </header>

      {/* Big Stats Cards - Refined Colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg"><Users size={22} /></div>
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <TrendingUp size={12} className="mr-1"/> +12%
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">2,543</h3>
                <p className="text-sm text-slate-500 font-medium">Total Registered Users</p>
            </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={22} /></div>
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <TrendingUp size={12} className="mr-1"/> +8.5%
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">₹4.2L</h3>
                <p className="text-sm text-slate-500 font-medium">Total Donations</p>
            </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle size={22} /></div>
                    <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        Attention
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">15</h3>
                <p className="text-sm text-slate-500 font-medium">Pending Payments</p>
            </div>
        </div>

        {/* Card 4 - Highlight */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-xl shadow-indigo-200 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={100} /></div>
            <div>
                <p className="font-medium text-indigo-100 mb-1">Monthly Goal</p>
                <h3 className="text-2xl font-bold">₹5.0 Lakhs</h3>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-indigo-100">
                    <span>Progress</span>
                    <span>75%</span>
                </div>
                <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="bg-white h-full w-3/4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Donation Trends</h3>
                    <p className="text-sm text-slate-400">Revenue over the last 7 days</p>
                </div>
                <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded transition">View Report <ArrowUpRight size={14}/></button>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 px-2">
                {[40, 65, 34, 78, 56, 90, 85].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 hover:bg-indigo-500 rounded-t-xl relative group transition-all duration-300" style={{height: `${h}%`}}>
                         {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none">
                            ₹{h}k
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-400 mt-4 px-4 uppercase tracking-wide">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg text-slate-800 mb-2 w-full text-left flex items-center gap-2"><PieChart size={18} className="text-slate-400"/> Status</h3>
            <p className="text-sm text-slate-400 w-full text-left mb-8">Payment success breakdown</p>
            
            <div className="relative w-48 h-48 mb-8">
                 {/* CSS Pie Chart */}
                <div className="w-full h-full rounded-full border-[24px] border-emerald-500 border-r-amber-400 border-b-rose-400 rotate-45 hover:scale-105 transition-transform duration-500 shadow-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-slate-800">850</span>
                    <span className="text-xs text-slate-400 font-medium uppercase">Total Txns</span>
                </div>
            </div>

            <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                    <span className="flex items-center gap-3 font-medium text-slate-600"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div> Successful</span>
                    <span className="font-bold text-slate-800">65%</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                    <span className="flex items-center gap-3 font-medium text-slate-600"><div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div> Pending</span>
                    <span className="font-bold text-slate-800">25%</span>
                </div>
                 <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                    <span className="flex items-center gap-3 font-medium text-slate-600"><div className="w-3 h-3 bg-rose-400 rounded-full shadow-sm"></div> Failed</span>
                    <span className="font-bold text-slate-800">10%</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
