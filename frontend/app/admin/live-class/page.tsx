'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Video, Loader2, X, Calendar, User, Link as LinkIcon, DollarSign, Image as ImageIcon } from 'lucide-react'

export default function AdminLiveClass() {
  const [liveClasses, setLiveClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { loadLiveClasses() }, [])

  const loadLiveClasses = async () => {
      setLoading(true)
      try {
          const res = await fetch('http://localhost:5000/api/admin/live-class', { credentials: 'include' })
          const json = await res.json()
          if(json.success) setLiveClasses(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSave = async () => {
      try {
          const url = editId ? `http://localhost:5000/api/admin/live-class/${editId}` : `http://localhost:5000/api/admin/live-class`
          const method = editId ? 'PUT' : 'POST'

          // Clone form data dan format ulang schedule ke ISO String untuk Postgres
          const payload = { ...formData }
          if (payload.schedule) {
              payload.schedule = new Date(payload.schedule).toISOString()
          }

          const res = await fetch(url, {
              method, headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload), credentials: 'include'
          })
          if(res.ok) { setModalOpen(false); loadLiveClasses(); }
      } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
      if(!confirm("Yakin hapus kelas ini? Data riwayat pembelian user untuk kelas ini bisa terdampak.")) return;
      try {
          const res = await fetch(`http://localhost:5000/api/admin/live-class/${id}`, { method: 'DELETE', credentials: 'include' })
          if(res.ok) loadLiveClasses()
      } catch (e) { console.error(e) }
  }

  // Fungsi khusus untuk ngebuka modal agar tanggal dari DB (ISO) terbaca oleh <input type="datetime-local">
  const openModal = (cls: any = null) => {
      setEditId(cls ? cls.id : null)
      
      if (cls) {
          let formattedDate = ''
          if (cls.schedule) {
              // Convert ISO string ke YYYY-MM-DDThh:mm local time
              const d = new Date(cls.schedule)
              const tzOffset = d.getTimezoneOffset() * 60000
              formattedDate = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16)
          }
          setFormData({ ...cls, schedule: formattedDate })
      } else {
          setFormData({ price: 0 })
      }
      setModalOpen(true)
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#5CD2DD] w-10 h-10" /></div>

  return (
    <div className="p-8 font-sans text-white h-full flex flex-col">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold">Manajemen Live Class</h1>
                <p className="text-gray-400 mt-2">Atur jadwal, harga, dan link pertemuan (Zoom/Meet/WA).</p>
            </div>
            <button onClick={() => openModal()} className="bg-[#5CD2DD] text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-[#4bc0cb] flex items-center gap-2 shadow-lg shadow-[#5CD2DD]/20">
                <Plus size={18} /> Buat Live Class
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.map(cls => {
                const dateObj = new Date(cls.schedule)
                const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Jadwal belum diset'

                return (
                    <div key={cls.id} className="bg-[#1E293B] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col group transition-all hover:border-[#5CD2DD]/50">
                        {/* IMAGE HEADER */}
                        <div className="relative h-40 bg-gray-700 w-full overflow-hidden">
                            {cls.image_url ? (
                                <img src={cls.image_url} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={40} /></div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(cls)} className="p-2 bg-black/60 backdrop-blur text-white hover:text-[#5CD2DD] rounded-lg"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(cls.id)} className="p-2 bg-black/60 backdrop-blur text-white hover:text-red-500 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#1E293B] to-transparent h-16" />
                        </div>
                        
                        {/* CONTENT */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-2 leading-tight text-white">{cls.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-5">{cls.description}</p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-[#5CD2DD]/10 text-[#5CD2DD] flex items-center justify-center shrink-0"><Calendar size={14}/></div>
                                    <span className="leading-tight">{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-[#5CD2DD]/10 text-[#5CD2DD] flex items-center justify-center shrink-0"><User size={14}/></div>
                                    <span>{cls.instructor_name || 'Instruktur belum ditentukan'}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1" />
                            
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-sm text-gray-400">Harga Tiket:</span>
                                <span className="text-xl font-black text-[#5CD2DD]">Rp {cls.price.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
            {liveClasses.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">Belum ada Live Class. Tambahkan kelas baru.</div>}
        </div>

        {/* MODAL FORM LIVE CLASS */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-3xl rounded-3xl border border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold">{editId ? 'Edit Live Class' : 'Buat Live Class Baru'}</h3>
                        <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* KOLOM KIRI: INFO UTAMA */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Judul Kelas</label>
                                <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Mastering UTBK Kuantitatif" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Deskripsi</label>
                                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none min-h-[100px]" placeholder="Apa yang akan dipelajari..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Nama Instruktur</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-3 focus-within:border-[#5CD2DD]">
                                    <User size={18} className="text-gray-500" />
                                    <input type="text" value={formData.instructor_name || ''} onChange={e => setFormData({...formData, instructor_name: e.target.value})} className="w-full bg-transparent p-3 text-white outline-none" placeholder="Kak Jerome Polin" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Harga (Rupiah)</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-3 focus-within:border-[#5CD2DD]">
                                    <DollarSign size={18} className="text-gray-500" />
                                    <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full bg-transparent p-3 text-white outline-none" placeholder="0 jika gratis" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">*Hanya masukkan angka tanpa titik/koma. Contoh: 50000</p>
                            </div>
                        </div>

                        {/* KOLOM KANAN: MEDIA & JADWAL */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Jadwal Kelas</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-3 focus-within:border-[#5CD2DD]">
                                    <Calendar size={18} className="text-gray-500" />
                                    <input type="datetime-local" value={formData.schedule || ''} onChange={e => setFormData({...formData, schedule: e.target.value})} className="w-full bg-transparent p-3 text-white outline-none" style={{ colorScheme: 'dark' }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5CD2DD] mb-2">URL Gambar Banner</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-3 focus-within:border-[#5CD2DD]">
                                    <ImageIcon size={18} className="text-gray-500" />
                                    <input type="text" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-transparent p-3 text-white outline-none" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="p-4 bg-[#5CD2DD]/5 border border-[#5CD2DD]/20 rounded-xl mt-4">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><LinkIcon size={16}/> Link Rahasia (Akses User)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">WhatsApp Group Link</label>
                                        <input type="text" value={formData.wa_link || ''} onChange={e => setFormData({...formData, wa_link: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#5CD2DD] outline-none" placeholder="https://chat.whatsapp.com/..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Meeting Link (Zoom/Meet)</label>
                                        <input type="text" value={formData.meeting_link || ''} onChange={e => setFormData({...formData, meeting_link: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#5CD2DD] outline-none" placeholder="https://zoom.us/j/..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-4 border-t border-white/10">
                        <button onClick={handleSave} className="w-full py-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20 text-lg">
                            {editId ? 'Simpan Perubahan Kelas' : 'Publikasikan Live Class'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}
