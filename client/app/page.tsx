import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-4 rounded-full shadow-xl mb-8 animate-bounce">
        <Heart className="text-indigo-600 fill-indigo-600" size={48} />
      </div>
      <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
        HopeConnect <span className="text-indigo-600">NGO</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Empowering change through transparent giving. Join our community of donors and make a real impact today.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          Login to Donate <ArrowRight size={20} />
        </Link>
        <Link 
          href="/register" 
          className="bg-white text-indigo-600 border-2 border-indigo-100 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all"
        >
          Create Account
        </Link>
      </div>
      
      <div className="mt-20 grid grid-cols-3 gap-12 text-center opacity-80">
         <div>
            <h3 className="text-3xl font-bold text-slate-800">5K+</h3>
            <p className="text-slate-500">Donors</p>
         </div>
         <div>
            <h3 className="text-3xl font-bold text-slate-800">₹2M+</h3>
            <p className="text-slate-500">Raised</p>
         </div>
         <div>
            <h3 className="text-3xl font-bold text-slate-800">100%</h3>
            <p className="text-slate-500">Transparent</p>
         </div>
      </div>
    </div>
  );
}
