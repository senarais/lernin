'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Video, FileQuestion, X, Check } from 'lucide-react'

export default function AdminSubjectDetail() {
  const { subjectId } = useParams()
  const router = useRouter()

  // State Data
  const [data, setData] = useState<any>(null) // { subject, modules }
  const [activeModule, setActiveModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // State Modals
  const [modalType, setModalType] = useState<'module' | 'quiz' | 'question' | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [editId, setEditId] = useState<string | null>(null)
  
  // State Khusus Options JSONB (Untuk Quiz Questions)
  const [questionOptions, setQuestionOptions] = useState<string[]>(['', '', '', ''])

  useEffect(() => {
    loadData()
  }, [subjectId])

  const loadData = async () => {
      setLoading(true)
      try {
          const res = await fetch(`http://localhost:5000/api/admin/subject/${subjectId}/modules`, { credentials: 'include' })
          const json = await res.json()
          if(json.success) {
              setData(json.data)
              // Update activeModule dengan data terbaru jika ada
              if (activeModule) {
                  const updatedMod = json.data.modules.find((m: any) => m.id === activeModule.id)
                  setActiveModule(updatedMod || null)
              }
          }
      } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  // ==========================================
  // API HANDLERS (CRUD)
  // ==========================================
  const handleSave = async () => {
      try {
          let url = ''
          let method = editId ? 'PUT' : 'POST'
          let payload = { ...formData }

          if (modalType === 'module') {
              url = editId ? `http://localhost:5000/api/admin/module/${editId}` : `http://localhost:5000/api/admin/subject/${subjectId}/module`
          } else if (modalType === 'quiz') {
              url = editId ? `http://localhost:5000/api/admin/quiz/${editId}` : `http://localhost:5000/api/admin/module/${activeModule.id}/quiz`
          } else if (modalType === 'question') {
              url = editId ? `http://localhost:5000/api/admin/quiz-question/${editId}` : `http://localhost:5000/api/admin/quiz/${formData.quiz_id}/question`
              // Parsing options array ke JSONB format
              payload.options = questionOptions.filter(o => o.trim() !== '') // Hapus opsi kosong
          }

          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              credentials: 'include'
          })

          if(res.ok) {
              setModalType(null)
              loadData()
          }
      } catch (e) { console.error(e) }
  }

  const handleDelete = async (type: string, id: string) => {
      if(!confirm(`Yakin ingin menghapus ${type} ini? Data yang terkait akan ikut terhapus.`)) return;
      try {
          let url = `http://localhost:5000/api/admin/${type}/${id}`
          const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
          if(res.ok) {
              if (type === 'module' && activeModule?.id === id) setActiveModule(null)
              loadData()
          }
      } catch (e) { console.error(e) }
  }

  // ==========================================
  // MODAL OPENERS
  // ==========================================
  const openModuleModal = (mod: any = null) => {
      setModalType('module')
      setEditId(mod ? mod.id : null)
      setFormData(mod ? { title: mod.title, video_url: mod.video_url, order_index: mod.order_index } : { order_index: data?.modules?.length + 1 })
  }

  const openQuizModal = (quiz: any = null) => {
      setModalType('quiz')
      setEditId(quiz ? quiz.id : null)
      setFormData(quiz ? { title: quiz.title } : {})
  }

  const openQuestionModal = (quizId: string, question: any = null) => {
      setModalType('question')
      setEditId(question ? question.id : null)
      
      if (question) {
          setFormData({ quiz_id: quizId, question: question.question, correct_answer: question.correct_answer })
          // Normalisasi options array (pastikan minimal ada 4 kotak)
          const opts = Array.isArray(question.options) ? [...question.options] : []
          while(opts.length < 4) opts.push('')
          setQuestionOptions(opts)
      } else {
          setFormData({ quiz_id: quizId, question: '', correct_answer: '' })
          setQuestionOptions(['', '', '', ''])
      }
  }

  // ==========================================
  // RENDER UI
  // ==========================================
  if (loading) return <div className="p-10 text-[#5CD2DD] flex justify-center"><Loader2 className="animate-spin w-10 h-10" /></div>
  if (!data) return <div className="p-10 text-white">Data tidak ditemukan.</div>

  return (
    <div className="p-8 h-full flex flex-col font-sans text-white">
        
        {/* HEADER & BREADCRUMB */}
        <div className="mb-8 border-b border-white/5 pb-6">
            <Link href="/admin/e-learning" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium w-max mb-6">
                <ArrowLeft size={16} /> Kembali ke Manajemen Mapel
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{data.subject.title}</h1>
            <p className="text-gray-400">Course: <span className="text-[#5CD2DD]">{data.subject.courses.title}</span></p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
            
            {/* PANEL KIRI: DAFTAR MODUL */}
            <div className="w-full lg:w-1/3 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0F172A]/50">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Video size={18} className="text-[#5CD2DD]" /> Modul Materi</h2>
                    <button onClick={() => openModuleModal()} className="bg-[#5CD2DD] text-slate-900 p-2 rounded-lg hover:bg-[#4bc0cb] transition-colors">
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    {data.modules.map((mod: any) => (
                        <div 
                            key={mod.id} 
                            onClick={() => setActiveModule(mod)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 group
                                ${activeModule?.id === mod.id ? 'bg-[#5CD2DD]/10 border-[#5CD2DD]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-gray-400 font-mono mb-1">Modul {mod.order_index}</div>
                                    <h3 className={`font-bold leading-tight ${activeModule?.id === mod.id ? 'text-[#5CD2DD]' : 'text-white'}`}>{mod.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); openModuleModal(mod); }} className="p-1.5 text-gray-400 hover:text-white bg-black/20 rounded-md"><Edit2 size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('module', mod.id); }} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-md"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1"><Video size={12}/> {mod.video_url ? 'Video Tersedia' : 'No Video'}</span>
                                <span className="flex items-center gap-1"><FileQuestion size={12}/> {mod.quizzes.length} Kuis</span>
                            </div>
                        </div>
                    ))}
                    {data.modules.length === 0 && <div className="text-center text-gray-500 py-10 text-sm">Belum ada modul.</div>}
                </div>
            </div>

            {/* PANEL KANAN: DETAIL MODUL & KUIS */}
            <div className="w-full lg:flex-1 bg-[#1E293B] rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden relative">
                {!activeModule ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                        <Video size={48} className="mb-4 opacity-20" />
                        <p>Pilih Modul di sebelah kiri untuk mengelola Video dan Kuis-nya.</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1 p-6 space-y-8">
                        
                        {/* SECTION: INFO MODUL & VIDEO */}
                        <div className="bg-bg border border-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Informasi Modul</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Judul Modul</p>
                                    <p className="font-medium text-lg">{activeModule.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">URL Video Pembelajaran</p>
                                    {activeModule.video_url ? (
                                        <a href={activeModule.video_url} target="_blank" rel="noreferrer" className="text-[#5CD2DD] hover:underline font-mono text-sm break-all">
                                            {activeModule.video_url}
                                        </a>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Belum ada link video tertaut.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION: QUIZ MANAGEMENT */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileQuestion className="text-[#5CD2DD]"/> Evaluasi Kuis</h2>
                                {/* Biasanya 1 modul cuma butuh 1 kuis, kita batasi visualnya */}
                                {activeModule.quizzes.length === 0 && (
                                    <button onClick={() => openQuizModal()} className="bg-[#5CD2DD]/10 text-[#5CD2DD] px-4 py-2 rounded-lg hover:bg-[#5CD2DD]/20 transition-colors font-bold text-sm flex items-center gap-2">
                                        <Plus size={16} /> Buat Kuis Baru
                                    </button>
                                )}
                            </div>

                            {activeModule.quizzes.length === 0 ? (
                                <div className="bg-bg border border-dashed border-white/10 rounded-2xl p-8 text-center text-gray-500">
                                    Belum ada kuis untuk modul ini. Tambahkan kuis untuk menguji pemahaman siswa.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeModule.quizzes.map((quiz: any) => (
                                        <div key={quiz.id} className="bg-bg border border-[#5CD2DD]/30 rounded-2xl overflow-hidden">
                                            {/* HEADER QUIZ */}
                                            <div className="bg-[#5CD2DD]/10 p-5 border-b border-[#5CD2DD]/20 flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#5CD2DD]">{quiz.title}</h3>
                                                    <p className="text-xs text-gray-400 mt-1">{quiz.quiz_questions.length} Soal Tersedia</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openQuestionModal(quiz.id)} className="bg-[#5CD2DD] text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-[#4bc0cb]"><Plus size={14}/> Soal</button>
                                                    <button onClick={() => openQuizModal(quiz)} className="p-1.5 text-gray-400 hover:text-white bg-black/20 rounded-lg"><Edit2 size={14} /></button>
                                                    <button onClick={() => handleDelete('quiz', quiz.id)} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg"><Trash2 size={14} /></button>
                                                </div>
                                            </div>

                                            {/* DAFTAR SOAL (QUESTIONS) */}
                                            <div className="p-5 space-y-4">
                                                {quiz.quiz_questions.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Kuis ini belum memiliki soal.</p>}
                                                {quiz.quiz_questions.map((q: any, idx: number) => (
                                                    <div key={q.id} className="p-4 rounded-xl bg-[#1E293B] border border-white/5 relative group">
                                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openQuestionModal(quiz.id, q)} className="p-1.5 text-gray-400 hover:text-[#5CD2DD] bg-bg rounded-md"><Edit2 size={14}/></button>
                                                            <button onClick={() => handleDelete('quiz-question', q.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-bg rounded-md"><Trash2 size={14}/></button>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{idx + 1}</div>
                                                            <div className="flex-1">
                                                                <p className="text-gray-200 font-medium mb-4 leading-relaxed pr-16">{q.question}</p>
                                                                <div className="space-y-2">
                                                                    {Array.isArray(q.options) && q.options.map((opt: string, oIdx: number) => {
                                                                        const isCorrect = q.correct_answer === opt;
                                                                        return (
                                                                            <div key={oIdx} className={`px-3 py-2 rounded-lg border text-sm flex justify-between items-center
                                                                                ${isCorrect ? 'border-[#25D366] bg-[#25D366]/10 text-white' : 'border-white/5 bg-black/20 text-gray-400'}`}>
                                                                                <span>{opt}</span>
                                                                                {isCorrect && <Check size={14} className="text-[#25D366]" />}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>

        {/* MODAL: ADD/EDIT MODULE */}
        {modalType === 'module' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{editId ? 'Edit Modul' : 'Tambah Modul'}</h3>
                        <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Judul Modul</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: Pengenalan Logika" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL Video (Youtube/Platform lain)</label>
                            <input type="text" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Urutan Tampil</label>
                            <input type="number" value={formData.order_index || 1} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" />
                        </div>
                        <button onClick={handleSave} className="w-full py-3 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20">Simpan Modul</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: ADD/EDIT QUIZ */}
        {modalType === 'quiz' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{editId ? 'Edit Kuis' : 'Buat Kuis'}</h3>
                        <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Judul Kuis</label>
                            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg border border-white/10 rounded-lg p-3 text-white focus:border-[#5CD2DD] outline-none" placeholder="Contoh: Latihan Soal Modul 1" />
                        </div>
                        <button onClick={handleSave} className="w-full py-3 mt-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20">Simpan Kuis</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL: ADD/EDIT QUESTION (JSONB LOGIC) */}
        {modalType === 'question' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1E293B] w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{editId ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
                        <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Pertanyaan</label>
                            <textarea value={formData.question || ''} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full bg-bg border border-white/10 rounded-xl p-4 text-white focus:border-[#5CD2DD] outline-none min-h-[100px]" placeholder="Tuliskan pertanyaan di sini..." />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Pilihan Jawaban</label>
                            <div className="space-y-3">
                                {questionOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {/* Radio Button untuk milih Kunci Jawaban */}
                                        <input 
                                            type="radio" 
                                            name="correct_answer" 
                                            className="w-5 h-5 accent-[#25D366] cursor-pointer"
                                            checked={formData.correct_answer === opt && opt !== ''}
                                            onChange={() => setFormData({...formData, correct_answer: opt})}
                                            title="Pilih sebagai jawaban benar"
                                        />
                                        <input 
                                            type="text" 
                                            value={opt} 
                                            onChange={e => {
                                                const newOpts = [...questionOptions]
                                                newOpts[idx] = e.target.value
                                                setQuestionOptions(newOpts)
                                                // Jika opsi yang lagi diedit itu dulunya jawaban benar, update correct_answer nya juga
                                                if (formData.correct_answer === questionOptions[idx]) {
                                                    setFormData({...formData, correct_answer: e.target.value})
                                                }
                                            }} 
                                            className={`flex-1 bg-bg border rounded-lg p-3 text-white outline-none transition-colors
                                                ${formData.correct_answer === opt && opt !== '' ? 'border-[#25D366] focus:border-[#25D366]' : 'border-white/10 focus:border-[#5CD2DD]'}`} 
                                            placeholder={`Opsi ${idx + 1}`} 
                                        />
                                    </div>
                                ))}
                                <button onClick={() => setQuestionOptions([...questionOptions, ''])} className="text-[#5CD2DD] text-sm font-bold flex items-center gap-1 mt-2 hover:underline">
                                    <Plus size={14}/> Tambah Opsi Lain
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">*Pilih radio button di sebelah kiri untuk menentukan kunci jawaban yang benar.</p>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <button onClick={handleSave} className="w-full py-4 bg-[#5CD2DD] text-slate-900 font-bold rounded-xl hover:bg-[#4bc0cb] shadow-lg shadow-[#5CD2DD]/20 text-lg">Simpan Soal</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}