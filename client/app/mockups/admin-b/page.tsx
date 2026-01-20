import React from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, FileText, UserCheck, Shield } from 'lucide-react';

export default function AdminDashboardOptionB() {
  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-sm">
       {/* Compact Sidebar */}
       <aside className="w-16 hover:w-56 bg-slate-800 text-slate-400 flex flex-col transition-all duration-300 overflow-hidden group z-10">
        <div className="h-16 flex items-center justify-center border-b border-slate-700 text-white font-bold text-xl">
             <Shield />
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-2">
             <a href="#" className="flex items-center gap-4 px-4 py-3 bg-blue-600 text-white"><FileText size={20} /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Transactions</span></a>
             <a href="#" className="flex items-center gap-4 px-4 py-3 hover:bg-slate-700 hover:text-white transition"><UserCheck size={20} /> <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Users</span></a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Toolbar */}
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-gray-700 text-lg">Donation Management</h2>
            <div className="flex gap-3">
                 <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300">Bulk Export</button>
                 <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm">+ Add Manual Record</button>
            </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-4 items-center shrink-0">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search by Transaction ID or Name..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600"><Filter size={14}/> Status: All</button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600">Date: Last 30 Days</button>
            </div>
            <div className="ml-auto text-gray-500">Showing 1-10 of 2,430 records</div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white p-6">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600 w-10"><input type="checkbox" /></th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Transaction ID</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Donor Name</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                        <tr key={i} className="hover:bg-blue-50 group">
                            <td className="px-4 py-3"><input type="checkbox" /></td>
                            <td className="px-4 py-3 font-mono text-gray-500">txn_829{i}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">Donor User {i}</td>
                            <td className="px-4 py-3 text-gray-500">Jan {20-i}, 2026</td>
                            <td className="px-4 py-3 font-semibold">₹{1000 * i}</td>
                            <td className="px-4 py-3">
                                {i % 3 === 0 ? (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">FAILED</span>
                                ) : i % 2 === 0 ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">SUCCESS</span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">PENDING</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100"><MoreHorizontal size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Pagination */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center shrink-0">
            <button className="px-4 py-2 border border-gray-300 bg-white rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <div className="flex gap-1">
                <button className="w-8 h-8 bg-blue-600 text-white rounded">1</button>
                <button className="w-8 h-8 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50">2</button>
                <button className="w-8 h-8 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50">3</button>
            </div>
            <button className="px-4 py-2 border border-gray-300 bg-white rounded text-gray-600 hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
      </main>
    </div>
  );
}
