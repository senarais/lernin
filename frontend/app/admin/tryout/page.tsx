'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ChevronRight, FileText, Loader2, X, Eye, EyeOff } from 'lucide-react'

export default function AdminTryout() {
  const [tryouts, setTryouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { loadTryouts() }, [])

  const loadTryouts = async () => {
      setLoading(true)
      try {
          const res = await fetch('http://localhost:5000/api/admin/tryout', { credentials: 'include' })
          const json = await res.json()
          if(json.success) setTryouts(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSave = async () => {
      try {
          const url = editId ? `http://localhost:5000/api/admin/tryout/${editId}` : `http://localhost:5000/api/admin/tryout`
          const method = editId ? 'PUT' : 'POST'
          const res = await fetch(url, {
              method, headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData), credentials: 'include'
          })
          if(res.ok) { setModalOpen(false); loadTryouts(); }
      } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
      if(!confirm("Hapus Tryout ini? SEMUA Sub-tes dan Soal di dalamnya akan ikut lenyap (Cascade).")) return;
      try {
          const res = await fetch(`http://localhost:5000/api/admin/tryout/${id}`, { method: 'DELETE', credentials: 'include' })
          if(res.ok) loadTryouts()
      } catch (e) { console.error(e) }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
      try {
          await fetch(`http://localhost:5000/api/admin/tryout/${id}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_published: !currentStatus }), credentials: 'include'
          })
          loadTryouts()
      } catch (e) { console.error(e) }
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#5CD2DD] w-10 h-10" /></div>

  return (
    <div className="p-8 font-sans text-white h-full flex flex-col">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold">Manajemen Tryout SNBT</h1>
                <p className="text-gray-400 mt-2">Kelola jadwal, publikasi, dan master simulasi CBT.</p>
            </div>
            <button onClick={() => { setFormData({ is_published: false }); setEditId(null); setModalOpen(true); }} className="bg-[#5CD2DD] text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-[#4bc0cb] flex items-center gap-2 shadow-lg shadow-[#5CD2DD]/20">
                <Plus size={18} /> Buat Tryout Baru
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tryouts.map(to => (
                <div key={to.id} className="bg-[#1E293B] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 text-xs font-bold rounded-full border ${to.is_published ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {to.is_published ? 'Published' : 'Draft'}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => togglePublish(to.id, to.is_published)} className="p-2 text-gray-400 hover:text-white bg-black/20 rounded-lg" title={to.is_published ? "Tarik dari peredaran" : "Publikasikan"}>
                                {to.is_published ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </button>
                            <button onClick={() => { setFormData(to); setEditId(to.id); setModalOpen(true); }} className="p-2 text-gray-400 hover:text-[#5CD2DD] bg-black/20 rounded-lg"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(to.id)} className="p-2 text-gray-400 hover:text-red-500 bg-black/20 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{to.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-6">{to.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <Link href={`/admin/tryout/${to.id}`}>
                            <button className="w-full py-3 bg-[#5CD2DD]/10 text-[#5CD2DD] font-bold rounded-xl hover:bg-[#5CD2DD]/20 transition-colors flex justify-center items-center gap-2">
                                <FileText size={16} /> Kelola Sub-tes & Soal <ChevronRight size={16} />
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
            {tryouts.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">Belum ada Tryout. Buat tryout pertama kamu.</div>}
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{editId ? 'Edit Master Tryout' : 'Buat Tryout Baru'}</h3>
                        <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Judul Tryout</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: Tryout UTBK Vol 2" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Deskripsi & Syarat</label>
                            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none min-h-[100px]" placeholder="Penjelasan singkat..." />
                        </div>
                        <button onClick={handleSave} className="w-full py-4 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20 text-lg">Simpan Master Tryout</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}