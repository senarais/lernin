'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

// Declare types untuk window.snap (biar typescript gak marah)
declare global {
  interface Window {
    snap: any;
  }
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBuyPro = async () => {
    setLoading(true)
    try {
      // 1. Minta Token ke Backend kita
      const res = await fetch('http://localhost:5000/api/payment/purchase', {
        method: 'POST',
        credentials: 'include' // Bawa cookie auth
      })
      
      const json = await res.json()
      
      if (!res.ok) throw new Error(json.error || "Gagal request payment")

      // 2. Panggil Midtrans SNAP Popup
      if (window.snap) {
        window.snap.pay(json.token, {
          onSuccess: function(result: any){
            alert("Pembayaran Berhasil! Akun kamu sekarang PRO selama 10 menit.");
            router.refresh();
            router.push('/dashboard'); // atau kemana gitu
          },
          onPending: function(result: any){
            alert("Menunggu pembayaran...");
          },
          onError: function(result: any){
            alert("Pembayaran gagal!");
          },
          onClose: function(){
            alert('Kamu menutup popup tanpa menyelesaikan pembayaran');
          }
        })
      }

    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Load Script Midtrans (Sandbox) */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-10">Upgrade to PRO</h1>
        
        <div className="bg-[#1E293B] p-8 rounded-2xl border border-white/10 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-third mb-4">Pro Plan (Test)</h2>
            <p className="text-4xl font-bold mb-6">Rp 19.000</p>
            <ul className="text-left space-y-3 mb-8 text-gray-400">
                <li>✅ Akses semua video</li>
                <li>✅ Akses semua kuis</li>
                <li>✅ Durasi 10 Menit (Demo)</li>
            </ul>

            <button 
                onClick={handleBuyPro}
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary/80 rounded-xl font-bold transition-all"
            >
                {loading ? 'Processing...' : 'Beli Sekarang'}
            </button>
        </div>
      </div>
    </>
  )
}