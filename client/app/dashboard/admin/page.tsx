'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Download, CheckCircle, Clock, XCircle, Shield, Search, FileText, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AdminDonation {
  _id: string;
  user: { name: string; email: string };
  amount: number;
  currency?: string;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionDate: string;
  campaign: string;
  razorpayPaymentId?: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'donors' | 'donations'>('overview');
  const [query, setQuery] = useState('');
  const [donorsPage, setDonorsPage] = useState(1);
  const [donationsPage, setDonationsPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const [userRole, setUserRole] = useState<'all' | 'user' | 'admin'>('all');
  const [userStartDate, setUserStartDate] = useState('');
  const [userEndDate, setUserEndDate] = useState('');
  const [donationStatus, setDonationStatus] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [donationStartDate, setDonationStartDate] = useState('');
  const [donationEndDate, setDonationEndDate] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/dashboard/user');
      return;
    }
    if (user && user.role === 'admin') {
      refreshData();
    }
  }, [user, authLoading, router]);

  const refreshData = async () => {
    try {
      const [uRes, dRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/donations'),
      ]);
      setUsers(uRes.data);
      setDonations(dRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = query.toLowerCase();
    const textMatch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const roleMatch = userRole === 'all' ? true : u.role === userRole;
    const created = new Date(u.createdAt).getTime();
    const startOk = userStartDate ? created >= new Date(userStartDate).getTime() : true;
    const endOk = userEndDate ? created <= new Date(userEndDate).getTime() : true;
    return textMatch && roleMatch && startOk && endOk;
  });

  const filteredDonations = donations.filter((d) => {
    const q = query.toLowerCase();
    const textMatch =
      (d.user?.name || '').toLowerCase().includes(q) ||
      (d.user?.email || '').toLowerCase().includes(q) ||
      (d.campaign || '').toLowerCase().includes(q) ||
      (d.paymentStatus || '').toLowerCase().includes(q);
    const statusMatch = donationStatus === 'all' ? true : d.paymentStatus === donationStatus;
    const ts = new Date(d.transactionDate).getTime();
    const startOk = donationStartDate ? ts >= new Date(donationStartDate).getTime() : true;
    const endOk = donationEndDate ? ts <= new Date(donationEndDate).getTime() : true;
    return textMatch && statusMatch && startOk && endOk;
  });

  const paginate = <T,>(arr: T[], page: number) => {
    const start = (page - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  };

  const exportCSV = (filename: string, rows: Record<string, unknown>[], headers: string[]) => {
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? '';
            const str = typeof val === 'string' ? val : String(val);
            const escaped = str.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRegistrations = users.length;
  const totalDonationsReceived = donations.reduce((sum, d) => sum + (d.paymentStatus === 'success' ? d.amount : 0), 0);
  const filteredDonationsReceived = filteredDonations.reduce((sum, d) => sum + (d.paymentStatus === 'success' ? d.amount : 0), 0);
  const donationCounts = {
    success: donations.filter((d) => d.paymentStatus === 'success').length,
    pending: donations.filter((d) => d.paymentStatus === 'pending').length,
    failed: donations.filter((d) => d.paymentStatus === 'failed').length,
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <aside className="w-64 bg-[#1a2332] text-slate-300 flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Shield className="text-white" size={20} />
          </div>
          <span className="text-white text-lg font-bold tracking-wide">Admin</span>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer ${tab === 'overview' ? 'bg-slate-800/50 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setTab('donors')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer ${tab === 'donors' ? 'bg-slate-800/50 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>
            <Users size={20} />
            <span>Donors</span>
          </button>
          <button onClick={() => setTab('donations')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer ${tab === 'donations' ? 'bg-slate-800/50 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>
            <FileText size={20} />
            <span>Donations</span>
          </button>
        </nav>
        <div className="mt-auto p-6 border-t border-slate-800/50">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer bg-rose-600 text-white hover:bg-rose-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {tab === 'overview' && 'Admin Overview'}
              {tab === 'donors' && 'User Management'}
              {tab === 'donations' && 'Donation Management'}
            </h1>
            <p className="text-slate-500">
              {tab === 'overview' && 'Key metrics and status at a glance.'}
              {tab === 'donors' && 'Manage donors (registrations).'}
              {tab === 'donations' && 'Manage donation records.'}
            </p>
          </div>
          <div className="flex gap-3">
            {tab !== 'overview' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setDonorsPage(1);
                      setDonationsPage(1);
                    }}
                    placeholder="Search"
                    className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <button
                  onClick={() => {
                    if (tab === 'donations') {
                      const rows = filteredDonations.map((d) => ({
                        donor: d.user?.name || '',
                        email: d.user?.email || '',
                        campaign: d.campaign || '',
                        date: new Date(d.transactionDate).toLocaleString(),
                        amount: d.amount,
                        currency: d.currency || 'INR',
                        status: d.paymentStatus,
                        paymentId: d.razorpayPaymentId || '',
                      }));
                      exportCSV('donations.csv', rows, ['donor', 'email', 'campaign', 'date', 'amount', 'currency', 'status', 'paymentId']);
                    } else {
                      const rows = filteredUsers.map((u) => ({
                        name: u.name,
                        email: u.email,
                        phone: u.phone,
                        role: u.role,
                        joined: new Date(u.createdAt).toLocaleString(),
                      }));
                      exportCSV('users.csv', rows, ['name', 'email', 'phone', 'role', 'joined']);
                    }
                  }}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Download size={16} /> Export
                </button>
              </>
            )}
            <button
              onClick={refreshData}
              className="text-slate-600 text-sm font-semibold hover:text-slate-900 flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all cursor-pointer border border-slate-200"
            >
              Refresh
            </button>
          </div>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 font-medium">Total Registrations</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalRegistrations}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 font-medium">Total Donations Received</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalDonationsReceived}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 font-medium">By Status</p>
              <div className="mt-2 text-sm text-slate-700">
                <span className="mr-4">Success: {donationCounts.success}</span>
                <span className="mr-4">Pending: {donationCounts.pending}</span>
                <span>Failed: {donationCounts.failed}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'donors' && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-slate-800">Donors</h3>
              <div className="flex items-center gap-3">
                <select
                  value={userRole}
                  onChange={(e) => {
                    setUserRole(e.target.value as 'all' | 'user' | 'admin');
                    setDonorsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="date"
                  value={userStartDate}
                  onChange={(e) => {
                    setUserStartDate(e.target.value);
                    setDonorsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={userEndDate}
                  onChange={(e) => {
                    setUserEndDate(e.target.value);
                    setDonorsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => {
                    setUserRole('all');
                    setUserStartDate('');
                    setUserEndDate('');
                    setDonorsPage(1);
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">Email</th>
                  <th className="px-8 py-4">Phone</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginate(filteredUsers, donorsPage).length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8">No users found.</td></tr>
                ) : paginate(filteredUsers, donorsPage).map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 font-medium text-slate-700">{u.name}</td>
                    <td className="px-8 py-5">{u.email}</td>
                    <td className="px-8 py-5">{u.phone}</td>
                    <td className="px-8 py-5">{u.role}</td>
                    <td className="px-8 py-5">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {donorsPage} of {Math.max(1, Math.ceil(filteredUsers.length / pageSize))}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  disabled={donorsPage <= 1}
                  onClick={() => setDonorsPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  disabled={donorsPage >= Math.ceil(filteredUsers.length / pageSize)}
                  onClick={() => setDonorsPage((p) => Math.min(Math.ceil(filteredUsers.length / pageSize) || 1, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'donations' && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-slate-800">Donations</h3>
              <div className="flex items-center gap-3">
                <select
                  value={donationStatus}
                  onChange={(e) => {
                    setDonationStatus(e.target.value as 'all' | 'success' | 'pending' | 'failed');
                    setDonationsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <input
                  type="date"
                  value={donationStartDate}
                  onChange={(e) => {
                    setDonationStartDate(e.target.value);
                    setDonationsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={donationEndDate}
                  onChange={(e) => {
                    setDonationEndDate(e.target.value);
                    setDonationsPage(1);
                  }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => {
                    setDonationStatus('all');
                    setDonationStartDate('');
                    setDonationEndDate('');
                    setDonationsPage(1);
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="px-8 py-3 text-sm text-slate-700">
              <span className="mr-6">Total received (all): {totalDonationsReceived}</span>
              <span>Filtered received: {filteredDonationsReceived}</span>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-4">Donor</th>
                  <th className="px-8 py-4">Campaign</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginate(filteredDonations, donationsPage).length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8">No donations found.</td></tr>
                ) : paginate(filteredDonations, donationsPage).map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 font-medium text-slate-700">{d.user?.name} <span className="text-slate-400">({d.user?.email})</span></td>
                    <td className="px-8 py-5">{d.campaign}</td>
                    <td className="px-8 py-5">{new Date(d.transactionDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-bold text-slate-800">{d.amount} {d.currency || ''}</td>
                    <td className="px-8 py-5">
                      {d.paymentStatus === 'success' && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                          <CheckCircle size={12} className="fill-emerald-200" /> Success
                        </span>
                      )}
                      {d.paymentStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium border border-amber-100">
                          <Clock size={12} className="fill-amber-200" /> Pending
                        </span>
                      )}
                      {d.paymentStatus === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs font-medium border border-rose-100">
                          <XCircle size={12} className="fill-rose-200" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {donationsPage} of {Math.max(1, Math.ceil(filteredDonations.length / pageSize))}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  disabled={donationsPage <= 1}
                  onClick={() => setDonationsPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  disabled={donationsPage >= Math.ceil(filteredDonations.length / pageSize)}
                  onClick={() => setDonationsPage((p) => Math.min(Math.ceil(filteredDonations.length / pageSize) || 1, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
