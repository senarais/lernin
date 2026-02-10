'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, Loader2, MessageCircle, Lock } from 'lucide-react' // Ganti icon Play jadi MessageCircle (WA)

type LiveClass = {
  id: string
  title: string
  description: string
  instructor_name: string
  price: number
  schedule: string
  image_url: string
  wa_link?: string // Tambah ini (bisa null/undefined)
  is_owned: boolean
  is_accessible: boolean
}

interface LiveClassCardProps {
  data: LiveClass
  isMyClassPage?: boolean 
}

export default function LiveClassCard({ data, isMyClassPage = false }: LiveClassCardProps) {
  const [loadingPay, setLoadingPay] = useState(false)

  const formattedDate = new Date(data.schedule).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  // Logic Payment Midtrans (Sama kayak sebelumnya)
  const handleBuy = async () => {
    setLoadingPay(true)
    try {
      const res = await fetch('http://localhost:5000/api/payment/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'class', itemId: data.id }),
        credentials: 'include'
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

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
      {/* Image Section */}
      <div className="relative w-full aspect-video bg-gray-700">
        <Image 
          src={data.image_url || '/landing/hero.png'} 
          alt={data.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!data.is_accessible && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
            Rp {data.price.toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* Content Section */}
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

        <div className="flex-1" />

        {/* --- ACTION BUTTON --- */}
        {data.is_accessible ? (
          // KALO UDAH PUNYA -> Langsung ke WA Link
          <a 
            href={data.wa_link || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
            onClick={(e) => {
                if (!data.wa_link) {
                    e.preventDefault();
                    alert("Link WhatsApp belum tersedia untuk kelas ini.");
                }
            }}
          >
             <button className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                {/* Pakai Warna Hijau WA (#25D366) */}
                Join WhatsApp Group <MessageCircle size={18} />
             </button>
          </a>
        ) : (
          // KALO BELUM PUNYA -> Trigger Payment (Midtrans)
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