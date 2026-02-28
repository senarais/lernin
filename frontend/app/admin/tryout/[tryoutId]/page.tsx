'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, X, FileText, CheckCircle } from 'lucide-react'

export default function AdminTryoutDetail() {
  const { tryoutId } = useParams()
  const [data, setData] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [modalType, setModalType] = useState<'section' | 'question' | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { loadData() }, [tryoutId])

  const loadData = async () => {
      setLoading(true)
      try {
          const res = await fetch(`http://localhost:5000/api/admin/tryout/${tryoutId}`, { credentials: 'include' })
          const json = await res.json()
          if(json.success) {
              setData(json.data)
              if (activeSection) {
                  const updatedSec = json.data.tryout_sections.find((s: any) => s.id === activeSection.id)
                  setActiveSection(updatedSec || null)
              }
          }
      } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSave = async () => {
      try {
          let url = ''
          let method = editId ? 'PUT' : 'POST'

          if (modalType === 'section') {
              url = editId ? `http://localhost:5000/api/admin/tryout-section/${editId}` : `http://localhost:5000/api/admin/tryout/${tryoutId}/section`
          } else if (modalType === 'question') {
              url = editId ? `http://localhost:5000/api/admin/tryout-question/${editId}` : `http://localhost:5000/api/admin/tryout/section/${activeSection.id}/question`
          }

          const res = await fetch(url, {
              method, headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData), credentials: 'include'
          })
          if(res.ok) { setModalType(null); loadData(); }
      } catch (e) { console.error(e) }
  }

  const handleDelete = async (type: string, id: string) => {
      if(!confirm(`Yakin hapus ${type} ini?`)) return;
      try {
          const res = await fetch(`http://localhost:5000/api/admin/tryout-${type}/${id}`, { method: 'DELETE', credentials: 'include' })
          if(res.ok) {
              if (type === 'section' && activeSection?.id === id) setActiveSection(null)
              loadData()
          }
      } catch (e) { console.error(e) }
  }

  const openSectionModal = (sec: any = null) => {
      setModalType('section')
      setEditId(sec ? sec.id : null)
      setFormData(sec ? { ...sec } : { order_index: data?.tryout_sections?.length + 1, duration_minutes: 30 })
  }

  const openQuestionModal = (q: any = null) => {
      setModalType('question')
      setEditId(q ? q.id : null)
      setFormData(q ? { ...q } : { correct_option: 'A' })
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#5CD2DD] w-10 h-10" /></div>
  if (!data) return <div className="p-10 text-white">Data tidak ditemukan.</div>

  return (
    <div className="p-8 h-full flex flex-col font-sans text-white">
        
        {/* HEADER */}
        <div className="mb-6 border-b border-white/5 pb-4">
            <Link href="/admin/tryout" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-max mb-4">
                <ArrowLeft size={16} /> Kembali ke Master Tryout
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{data.title}</h1>
            <p className="text-gray-400">Total {data.tryout_sections.length} Sub-tes</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
            
            {/* KIRI: SUB-TES (SECTIONS) */}
            <div className="w-full lg:w-1/3 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0F172A]/50">
                    <h2 className="font-bold text-lg">Daftar Sub-tes (Mapel)</h2>
                    <button onClick={() => openSectionModal()} className="bg-[#5CD2DD] text-slate-900 p-2 rounded-lg hover:bg-[#4bc0cb]"><Plus size={16} strokeWidth={3}/></button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    {data.tryout_sections.map((sec: any) => (
                        <div 
                            key={sec.id} onClick={() => setActiveSection(sec)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 group
                                ${activeSection?.id === sec.id ? 'bg-[#5CD2DD]/10 border-[#5CD2DD]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-gray-400 font-mono mb-1">Urutan {sec.order_index} | {sec.duration_minutes} Menit</div>
                                    <h3 className={`font-bold ${activeSection?.id === sec.id ? 'text-[#5CD2DD]' : 'text-white'}`}>{sec.title}</h3>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                    <button onClick={(e) => { e.stopPropagation(); openSectionModal(sec); }} className="p-1.5 text-gray-400 hover:text-white bg-black/20 rounded-md"><Edit2 size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('section', sec.id); }} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-md"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-2">
                                {sec.tryout_questions.length} Soal terdaftar
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* KANAN: SOAL & PEMBAHASAN */}
            <div className="w-full lg:flex-1 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                {!activeSection ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>Pilih Sub-tes di panel kiri untuk mengelola Bank Soal.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0F172A]/50">
                            <div>
                                <h2 className="font-bold text-lg text-white">Bank Soal</h2>
                                <p className="text-xs text-[#5CD2DD] mt-1">{activeSection.title}</p>
                            </div>
                            <button onClick={() => openQuestionModal()} className="bg-[#5CD2DD] text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#4bc0cb]">
                                <Plus size={16} /> Buat Soal
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {activeSection.tryout_questions.length === 0 && <div className="text-center text-gray-500 py-20">Belum ada soal.</div>}
                            
                            {activeSection.tryout_questions.map((q: any, idx: number) => (
                                <div key={q.id} className="bg-bg border border-white/10 rounded-2xl p-6 relative group hover:border-[#5CD2DD]/30 transition-all">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openQuestionModal(q)} className="p-2 text-gray-400 hover:text-[#5CD2DD] bg-white/5 rounded-lg"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDelete('question', q.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white/5 rounded-lg"><Trash2 size={14}/></button>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#5CD2DD]/10 text-[#5CD2DD] border border-[#5CD2DD]/30 flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                                        <div className="flex-1">
                                            <p className="text-gray-200 font-medium mb-6 leading-relaxed pr-16">{q.question_text}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                {['A', 'B', 'C', 'D', 'E'].map(opt => {
                                                    const text = q[`option_${opt.toLowerCase()}`]
                                                    if (!text) return null;
                                                    const isCorrect = q.correct_option === opt;
                                                    return (
                                                        <div key={opt} className={`px-4 py-3 rounded-xl border text-sm flex gap-3 ${isCorrect ? 'border-[#25D366] bg-[#25D366]/10 text-white' : 'border-white/5 bg-black/20 text-gray-400'}`}>
                                                            <span className={`font-bold ${isCorrect ? 'text-[#25D366]' : 'text-gray-500'}`}>{opt}.</span>
                                                            <span className="flex-1">{text}</span>
                                                            {isCorrect && <CheckCircle size={16} className="text-[#25D366] shrink-0" />}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {q.explanation && (
                                                <div className="p-4 bg-[#5CD2DD]/5 border border-[#5CD2DD]/20 rounded-xl text-sm text-gray-300">
                                                    <span className="font-bold text-[#5CD2DD] block mb-1">Pembahasan:</span>
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* MODAL: SUB-TES */}
        {modalType === 'section' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{editId ? 'Edit Sub-tes' : 'Tambah Sub-tes'}</h3>
                        <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Nama Sub-tes (Mapel)</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: Penalaran Umum" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-2">Durasi (Menit)</label>
                                <input type="number" value={formData.duration_minutes || ''} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-2">Urutan Tampil</label>
                                <input type="number" value={formData.order_index || ''} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-3 text-white focus:border-[#5CD2DD] outline-none" />
                            </div>
                        </div>
                        <button onClick={handleSave} className="w-full py-4 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20">Simpan Sub-tes</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: SOAL (KHUSUS FORMAT UTBK - A B C D E) */}
        {modalType === 'question' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-4xl rounded-3xl border border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{editId ? 'Edit Soal CBT' : 'Buat Soal CBT Baru'}</h3>
                        <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Pertanyaan</label>
                            <textarea value={formData.question_text || ''} onChange={e => setFormData({...formData, question_text: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-4 text-white focus:border-[#5CD2DD] outline-none min-h-[120px]" placeholder="Tuliskan teks pertanyaan / cerita..." />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-[#5CD2DD] mb-3">Opsi Jawaban & Kunci</label>
                            <p className="text-xs text-gray-400 mb-4">*Pilih Radio Button hijau untuk menentukan kunci jawaban.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D', 'E'].map(opt => (
                                    <div key={opt} className="flex items-start gap-3">
                                        <div className="pt-3">
                                            <input 
                                                type="radio" name="correct_option" value={opt} 
                                                checked={formData.correct_option === opt}
                                                onChange={e => setFormData({...formData, correct_option: e.target.value})}
                                                className="w-5 h-5 accent-[#25D366] cursor-pointer" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center text-xs font-bold text-gray-500 mb-1 ml-1">Opsi {opt}</div>
                                            <textarea 
                                                value={formData[`option_${opt.toLowerCase()}`] || ''} 
                                                onChange={e => setFormData({...formData, [`option_${opt.toLowerCase()}`]: e.target.value})} 
                                                className={`w-full bg-[#0F172A] border rounded-xl p-3 text-sm text-white outline-none min-h-[60px] transition-colors
                                                    ${formData.correct_option === opt ? 'border-[#25D366] focus:border-[#25D366]' : 'border-white/10 focus:border-[#5CD2DD]'}`} 
                                                placeholder={`Jawaban ${opt}`} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <label className="block text-sm font-bold text-[#5CD2DD] mb-2">Pembahasan (Review)</label>
                            <textarea value={formData.explanation || ''} onChange={e => setFormData({...formData, explanation: e.target.value})} className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-4 text-white focus:border-[#5CD2DD] outline-none min-h-[120px]" placeholder="Masukkan penjelasan kenapa jawaban tersebut benar..." />
                        </div>

                        <div className="pt-6">
                            <button onClick={handleSave} className="w-full py-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20 text-lg">Simpan Soal CBT</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}