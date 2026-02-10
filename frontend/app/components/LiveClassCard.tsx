'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Loader2, PlayCircle, Lock } from 'lucide-react'

// Tipe data sesuai response API Backend
type LiveClass = {
  id: string
  title: string
  description: string
  instructor_name: string
  price: number
  schedule: string
  image_url: string
  is_owned: boolean
  is_accessible: boolean
}

interface LiveClassCardProps {
  data: LiveClass
  isMyClassPage?: boolean // Flag untuk membedakan tampilan katalog vs my class
}

export default function LiveClassCard({ data, isMyClassPage = false }: LiveClassCardProps) {
  const [loadingPay, setLoadingPay] = useState(false)

  // Format Tanggal (Pengganti '18 Hours' biar dinamis sesuai DB)
  const formattedDate = new Date(data.schedule).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  // --- Logic Payment (Midtrans) ---
  const handleBuy = async () => {
    setLoadingPay(true)
    try {
      // 1. Minta Token
      const res = await fetch('http://localhost:5000/api/payment/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'class', itemId: data.id }),
        credentials: 'include'
      })
      const json = await res.json()
      
      if (!res.ok) throw new Error(json.error)

      // 2. Munculin Popup
      if (window.snap) {
        window.snap.pay(json.token, {
          onSuccess: function() {
            alert("Pembayaran Berhasil! Refresh halaman untuk akses.")
            window.location.reload()
          },
          onPending: () => alert("Menunggu pembayaran..."),
          onError: () => alert("Pembayaran gagal!"),
        })
      }
    } catch (error) {
      console.error(error)
      alert("Gagal memproses transaksi")
    } finally {
      setLoadingPay(false)
    }
  }

  return (
    <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-lg border border-white/5 hover:border-[#5CD2DD]/50 transition-all group flex flex-col h-full">
      {/* --- Image Section --- */}
      <div className="relative w-full aspect-video bg-gray-700">
        <Image 
          src={data.image_url || '/landing/hero.png'} // Fallback image
          alt={data.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge Harga jika belum beli */}
        {!data.is_accessible && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
            Rp {data.price.toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight min-h-[3.5rem]">
          {data.title}
        </h3>

        <div className="flex items-start gap-3 mb-6">
          <div className="mt-0.5 text-[#5CD2DD]">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{formattedDate}</p>
            <p className="text-gray-400 text-xs mt-0.5">Live via Zoom/Meet</p>
          </div>
        </div>

        {/* Spacer biar button selalu di bawah */}
        <div className="flex-1" />

        {/* --- Action Button --- */}
        {data.is_accessible ? (
          // KALO UDAH PUNYA -> Link ke Detail Page
          <Link href={`/live-class/${data.id}`} className="w-full">
             <button className="w-full py-3 rounded-xl bg-[#5CD2DD] hover:bg-[#4bc0cb] text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-2">
                Join Live Class <PlayCircle size={16} />
             </button>
          </Link>
        ) : (
          // KALO BELUM PUNYA -> Trigger Payment
          <button 
            onClick={handleBuy}
            disabled={loadingPay}
            className="w-full py-3 rounded-xl bg-[#1E293B] border border-[#5CD2DD] text-[#5CD2DD] hover:bg-[#5CD2DD] hover:text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            {loadingPay ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
            {loadingPay ? 'Processing...' : 'Beli Sekarang'}
          </button>
        )}
      </div>
    </div>
  )
}