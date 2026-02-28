'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link' // <-- FIX: Jangan lupa import Link
import { Plus, Edit2, Trash2, ChevronRight, Layers, Loader2, X } from 'lucide-react'

export default function AdminELearning() {
  // State Data
  const [courses, setCourses] = useState<any[]>([])
  const [activeCourse, setActiveCourse] = useState<any>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [subLoading, setSubLoading] = useState(false)

  // State Modals
  const [isCourseModalOpen, setCourseModalOpen] = useState(false)
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)

  // Initial Fetch Courses
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
      setLoading(true)
      try {
          const res = await fetch('http://localhost:5000/api/admin/course', { credentials: 'include' })
          const json = await res.json()
          if(json.success) setCourses(json.data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSelectCourse = async (course: any) => {
      setActiveCourse(course)
      setSubLoading(true)
      try {
          const res = await fetch(`http://localhost:5000/api/admin/course/${course.id}/subject`, { credentials: 'include' })
          const json = await res.json()
          if(json.success) setSubjects(json.data)
      } catch (e) { console.error(e) } finally { setSubLoading(false) }
  }

  // ==========================================
  // HANDLERS UNTUK COURSE (Jurusan)
  // ==========================================
  const saveCourse = async () => {
      try {
          const url = editId ? `http://localhost:5000/api/admin/course/${editId}` : `http://localhost:5000/api/admin/course`
          const method = editId ? 'PUT' : 'POST'

          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
              credentials: 'include'
          })
          if(res.ok) {
              setCourseModalOpen(false)
              loadCourses()
          }
      } catch (e) { console.error(e) }
  }

  const deleteCourse = async (id: string, e: any) => {
      e.stopPropagation()
      if(!confirm("Hapus Course? Semua Mapel, Modul, dan Quiz di dalamnya akan ikut terhapus (Cascade).")) return;
      try {
          const res = await fetch(`http://localhost:5000/api/admin/course/${id}`, { method: 'DELETE', credentials: 'include' })
          if(res.ok) {
              if(activeCourse?.id === id) setActiveCourse(null)
              loadCourses()
          }
      } catch (e) { console.error(e) }
  }

  // ==========================================
  // HANDLERS UNTUK SUBJECT (Mapel)
  // ==========================================
  const saveSubject = async () => {
      try {
          const url = editId 
              ? `http://localhost:5000/api/admin/subject/${editId}` 
              : `http://localhost:5000/api/admin/course/${activeCourse.id}/subject`
          const method = editId ? 'PUT' : 'POST'

          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
              credentials: 'include'
          })
          if(res.ok) {
              setSubjectModalOpen(false)
              handleSelectCourse(activeCourse) // Reload subjects
          }
      } catch (e) { console.error(e) }
  }

  const deleteSubject = async (id: string) => {
      if(!confirm("Hapus Mapel ini? Semua Modul akan hilang.")) return;
      try {
          const res = await fetch(`http://localhost:5000/api/admin/subject/${id}`, { method: 'DELETE', credentials: 'include' })
          if(res.ok) {
              handleSelectCourse(activeCourse)
          }
      } catch (e) { console.error(e) }
  }

  // ==========================================
  // RENDER UI
  // ==========================================
  if (loading) return <div className="p-10 text-[#5CD2DD] flex justify-center"><Loader2 className="animate-spin w-10 h-10" /></div>

  return (
    <div className="p-8 h-full flex flex-col">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Manajemen E-Learning</h1>
            <p className="text-gray-400 mt-2">Kelola Program (Course) dan Mata Pelajaran (Subject).</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
            
            {/* PANEL KIRI: DAFTAR COURSE */}
            <div className="w-full lg:w-1/3 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0F172A]/50">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Layers size={18} className="text-[#5CD2DD]" /> Courses</h2>
                    <button 
                        onClick={() => { setFormData({}); setEditId(null); setCourseModalOpen(true); }}
                        className="bg-[#5CD2DD] text-slate-900 p-2 rounded-lg hover:bg-[#4bc0cb] transition-colors"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    {courses.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => handleSelectCourse(c)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all group flex justify-between items-center
                                ${activeCourse?.id === c.id ? 'bg-[#5CD2DD]/10 border-[#5CD2DD]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div>
                                <h3 className={`font-bold ${activeCourse?.id === c.id ? 'text-[#5CD2DD]' : 'text-white'}`}>{c.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">/{c.slug}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setFormData(c); setEditId(c.id); setCourseModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-white bg-black/20 rounded-md">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={(e) => deleteCourse(c.id, e)} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-md transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && <div className="text-center text-gray-500 py-10 text-sm">Belum ada Course.</div>}
                </div>
            </div>

            {/* PANEL KANAN: DAFTAR SUBJECT */}
            <div className="w-full lg:flex-1 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden relative">
                {!activeCourse ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <Layers size={48} className="mb-4 opacity-20" />
                        <p>Pilih Course di sebelah kiri untuk mengelola Mata Pelajaran.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0F172A]/50">
                            <div>
                                <h2 className="font-bold text-lg text-white">Mata Pelajaran</h2>
                                <p className="text-xs text-[#5CD2DD] mt-1">Course: {activeCourse.title}</p>
                            </div>
                            <button 
                                onClick={() => { setFormData({ order_index: subjects.length + 1 }); setEditId(null); setSubjectModalOpen(true); }}
                                className="bg-[#5CD2DD] text-slate-900 px-4 py-2 rounded-lg hover:bg-[#4bc0cb] transition-colors font-bold text-sm flex items-center gap-2"
                            >
                                <Plus size={16} /> Tambah Mapel
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {subLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#5CD2DD]" /></div>
                            ) : subjects.length === 0 ? (
                                <div className="text-center text-gray-500 py-20">Belum ada mata pelajaran di course ini.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {subjects.map(sub => (
                                        <div key={sub.id} className="bg-bg border border-white/10 rounded-xl p-5 hover:border-[#5CD2DD]/50 transition-all flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 font-mono">Urutan: {sub.order_index}</div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setFormData(sub); setEditId(sub.id); setSubjectModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-[#5CD2DD]"><Edit2 size={14}/></button>
                                                    <button onClick={() => deleteSubject(sub.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white mb-1 line-clamp-1">{sub.title}</h3>
                                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{sub.description || 'Tidak ada deskripsi'}</p>
                                            
                                            <div className="mt-auto pt-4 border-t border-white/5">
                                                {/* FIX: Bungkus button pakai Link untuk routing ke halaman detail mapel */}
                                                <Link href={`/admin/e-learning/${sub.id}`}>
                                                    <button className="w-full py-2 bg-[#5CD2DD]/10 text-[#5CD2DD] text-xs font-bold rounded-lg hover:bg-[#5CD2DD]/20 transition-colors flex justify-center items-center gap-1">
                                                        Kelola Modul & Video <ChevronRight size={14} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* MODAL: ADD/EDIT COURSE */}
        {isCourseModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{editId ? 'Edit Course' : 'Tambah Course Baru'}</h3>
                        <button onClick={() => setCourseModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nama Course</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: UTBK SNBT 2026" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
                            <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: utbk-snbt" />
                        </div>
                        <button onClick={saveCourse} className="w-full py-3 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20">Simpan Course</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: ADD/EDIT SUBJECT */}
        {isSubjectModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{editId ? 'Edit Mapel' : 'Tambah Mapel'}</h3>
                        <button onClick={() => setSubjectModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nama Mapel</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#5CD2DD]" placeholder="Contoh: Penalaran Matematika" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Deskripsi Singkat</label>
                            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#5CD2DD] h-24" placeholder="Deskripsi materi..." />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">Urutan Tampil</label>
                                <input type="number" value={formData.order_index || 1} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#5CD2DD]" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">Grade (Opsional)</label>
                                <select value={formData.grade_level || ''} onChange={e => setFormData({...formData, grade_level: e.target.value ? parseInt(e.target.value) : null})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#5CD2DD]">
                                    <option value="">Semua Kelas</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={saveSubject} className="w-full py-3 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20">Simpan Mata Pelajaran</button>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}