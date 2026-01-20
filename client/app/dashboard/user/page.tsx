'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Settings, Download, CheckCircle, Clock, XCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Donation {
  _id: string;
  amount: number;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionDate: string;
  campaign: string;
  razorpayPaymentId: string;
  currency?: string;
  razorpayOrderId?: string;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => Promise<void> | void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    payhere: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: unknown) => void;
    };
  }
}

export default function UserDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<number | ''>('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
    }
    if (user) {
        fetchDonations();
    }
  }, [user, authLoading, router]);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations/my');
      setDonations(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (amount: number) => {
    try {
        

        const { data: order } = await api.post('/donations/create-order', {
          amount: amount,
          campaign: 'General Fund',
        });
        // Reflect pending entry immediately
        fetchDonations();

        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: 'INR',
            name: 'HopeConnect NGO',
            description: 'Donation for a good cause',
            order_id: order.id,
            handler: async function (response: RazorpayPaymentResponse) {
                try {
                    await api.post('/donations/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: amount,
                        campaign: 'General Fund'
                    });
                    toast.success('Donation Successful!');
                    fetchDonations();
                } catch (err) {
                    console.error(err);
                    toast.error('Payment Verification Failed');
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: '9999999999'
            },
            theme: {
                color: '#4f46e5'
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        const pollInterval = window.setInterval(() => {
          fetchDonations();
        }, 3000);

        const failFallback = window.setTimeout(async () => {
          try {
            await api.post('/donations/mark-failed', { razorpay_order_id: order.id });
          } catch {}
          fetchDonations();
          window.clearInterval(pollInterval);
        }, 90000);
        
        rzp1.on('payment.failed', async function () {
             try {
               await api.post('/donations/mark-failed', { razorpay_order_id: order.id });
             } catch {}
             toast.error('Payment Failed');
             setDonations((prev) => {
               const idx = prev.findIndex((d) => d.razorpayOrderId === order.id);
               const next = idx >= 0
                 ? prev.map((d) => d.razorpayOrderId === order.id ? { ...d, paymentStatus: 'failed' as const, transactionDate: new Date().toISOString() } : d)
                 : [
                     {
                       _id: 'local_' + Date.now(),
                       amount: amount,
                       paymentStatus: 'failed' as const,
                       transactionDate: new Date().toISOString(),
                       campaign: 'General Fund',
                       razorpayPaymentId: '',
                       currency: 'INR',
                       razorpayOrderId: order.id
                     } as Donation,
                     ...prev
                   ];
               return next.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
             });
             fetchDonations();
             window.clearTimeout(failFallback);
             window.clearInterval(pollInterval);
        });

        rzp1.on('modal.closed', async function () {
          try {
            await api.post('/donations/mark-failed', { razorpay_order_id: order.id });
          } catch {}
          toast.error('Payment Cancelled');
          setDonations((prev) => {
            const idx = prev.findIndex((d) => d.razorpayOrderId === order.id);
            const next = idx >= 0
              ? prev.map((d) => d.razorpayOrderId === order.id ? { ...d, paymentStatus: 'failed' as const, transactionDate: new Date().toISOString() } : d)
              : [
                  {
                    _id: 'local_' + Date.now(),
                    amount: amount,
                    paymentStatus: 'failed' as const,
                    transactionDate: new Date().toISOString(),
                    campaign: 'General Fund',
                    razorpayPaymentId: '',
                    currency: 'INR',
                    razorpayOrderId: order.id
                  } as Donation,
                  ...prev
                ];
            return next.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
          });
          fetchDonations();
          window.clearTimeout(failFallback);
          window.clearInterval(pollInterval);
        });

    } catch (error) {
        console.error(error);
        toast.error('Could not initiate donation');
    }
  };

  if (authLoading || loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const totalDonated = donations
    .filter(d => d.paymentStatus === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const visibleDonations = donations.filter(d => d.paymentStatus !== 'pending');
  const lastDonationDate = visibleDonations.length > 0 
    ? new Date(visibleDonations[0].transactionDate).toLocaleDateString() 
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <aside className="w-64 bg-[#1a2332] text-slate-300 flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Heart className="text-white fill-white" size={20} />
          </div>
          <span className="text-white text-lg font-bold tracking-wide">HopeConnect</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-2">Menu</p>
          <Link href="/dashboard/user" className="flex items-center gap-3 px-4 py-3.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:translate-x-1 cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/dashboard/user/transactions" className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all cursor-pointer">
            <Download size={20} />
            <span>All Transactions</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t border-slate-800/50 mt-auto">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all group text-left cursor-pointer">
            <Settings size={20} className="group-hover:text-indigo-400 transition-colors" /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500">Your generosity is changing lives. Here&apos;s your impact overview.</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">₹</span>
              <input
                type="number"
                min={1}
                step={1}
                value={donationAmount}
                onChange={(e) => {
                  const v = e.target.value;
                  setDonationAmount(v === '' ? '' : Math.max(1, Math.floor(Number(v))));
                }}
                className="w-32 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-black"
                placeholder="Amount"
              />
            </div>
            <button
              onClick={() => {
                if (typeof donationAmount === 'number' && donationAmount > 0) {
                  handleDonate(donationAmount);
                } else {
                  toast.error('Please enter a valid amount (₹1 or more)');
                }
              }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart size={18} className="fill-indigo-400 text-indigo-400" /> Donate
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{user?.name}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <LayoutDashboard size={24} />
                </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Donated</p>
            <h3 className="text-3xl font-bold text-slate-800">₹{totalDonated}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-emerald-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Heart size={24} />
                </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Donations Count</p>
            <h3 className="text-3xl font-bold text-slate-800">{donations.filter(d => d.paymentStatus === 'success').length}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-orange-100 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Clock size={24} />
                </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Last Donation</p>
            <h3 className="text-xl font-bold text-slate-800">{lastDonationDate}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-slate-800">Recent Contributions</h3>
            <div />
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Campaign</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleDonations.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">No completed or failed donations yet.</td></tr>
              ) : visibleDonations.slice(0, 5).map((donation) => (
                <tr key={donation._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-slate-400">
                      #{(donation.razorpayPaymentId && donation.razorpayPaymentId.slice(-8)) || (donation.razorpayOrderId && donation.razorpayOrderId.slice(-8)) || 'FAILED'}
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-700">{donation.campaign}</td>
                    <td className="px-8 py-5 text-slate-500">{new Date(donation.transactionDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-bold text-slate-800">{donation.amount} {donation.currency || ''}</td>
                    <td className="px-8 py-5">
                        {donation.paymentStatus === 'success' && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                                <CheckCircle size={12} className="fill-emerald-200" /> Success
                            </span>
                        )}
                         {donation.paymentStatus === 'failed' as const && (
                             <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs font-medium border border-rose-100">
                                <XCircle size={12} className="fill-rose-200" /> Failed
                            </span>
                        )}
                    </td>
                    
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
