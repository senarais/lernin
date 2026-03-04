'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import { Loader2, User, Mail, ShieldCheck, GraduationCap, Phone, Save, CheckCircle } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        phone_number: '',
        school: ''
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' })
                const json = await res.json()
                if (json.user) {
                    setUser(json.user)
                    setFormData({
                        username: json.user.username || '',
                        full_name: json.user.full_name || '',
                        phone_number: json.user.phone_number || '',
                        school: json.user.school || ''
                    })
                } else {
                    router.push('/login') // Kick kalau blm login
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setErrorMsg('')
        setSuccessMsg('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            const json = await res.json()
            
            if (res.ok && json.success) {
                setSuccessMsg('Profil berhasil diperbarui!')
                // Update local state biar namanya di layar langsung ganti
                setUser({ ...user, ...formData })
                // Hilangkan pesan sukses setelah 3 detik
                setTimeout(() => setSuccessMsg(''), 3000)
            } else {
                setErrorMsg(json.error || 'Terjadi kesalahan saat menyimpan.')
            }
        } catch (error) {
            setErrorMsg('Koneksi bermasalah.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-bg flex justify-center items-center">
            <Loader2 className="animate-spin text-third w-12 h-12" />
        </div>
    )

    return (
        <div className="min-h-screen bg-bg text-white overflow-x-hidden font-sans pb-20">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-4 pt-32">
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
                    {/* Lingkaran Inisial Nama Pengganti Profile Picture */}
                    <div className="w-24 h-24 rounded-full bg-third text-bg font-black text-4xl flex items-center justify-center shadow-[0_0_30px_rgba(92,210,221,0.3)] shrink-0">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">My Profile</h1>
                        <p className="text-gray-400">Atur informasi pribadi dan lihat status akunmu.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* PANEL KIRI: INFO AKUN (READ ONLY) */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-[#1E293B] border border-white/5 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="text-third" size={20}/> Status Akun</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Email Terdaftar</p>
                                    <p className="font-medium text-sm flex items-center gap-2">
                                        <Mail size={14} className="text-gray-500"/> {user.email}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs text-gray-400 mb-2">Paket Berlangganan</p>
                                    <div className="inline-block px-3 py-1 bg-third/10 border border-third/20 text-third text-xs font-bold rounded-full uppercase tracking-wider">
                                        {user.subscription_plan || 'Free'}
                                    </div>
                                    {user.subscription_plan !== 'free' && user.subscription_expires_at && (
                                        <p className="text-xs text-gray-500 mt-2">Aktif s/d: {new Date(user.subscription_expires_at).toLocaleDateString('id-ID')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PANEL KANAN: FORM EDIT PROFIL */}
                    <div className="md:col-span-2 bg-[#1E293B] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">Informasi Personal</h3>
                        
                        {successMsg && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-medium">
                                <CheckCircle size={18} /> {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-4 focus-within:border-third transition-colors">
                                    <User size={18} className="text-gray-500" />
                                    <input 
                                        type="text" name="username" value={formData.username} onChange={handleChange} required
                                        className="w-full bg-transparent p-3 text-white outline-none" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Nama Lengkap</label>
                                <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-4 focus-within:border-third transition-colors">
                                    <input 
                                        type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                                        className="w-full bg-transparent p-3 text-white outline-none" 
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Nomor HP / WhatsApp</label>
                                    <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-4 focus-within:border-third transition-colors">
                                        <Phone size={18} className="text-gray-500" />
                                        <input 
                                            type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange}
                                            className="w-full bg-transparent p-3 text-white outline-none ml-2" 
                                            placeholder="0812..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Asal Sekolah</label>
                                    <div className="flex items-center bg-[#0F172A] border border-white/10 rounded-xl px-4 focus-within:border-third transition-colors">
                                        <GraduationCap size={18} className="text-gray-500" />
                                        <input 
                                            type="text" name="school" value={formData.school} onChange={handleChange}
                                            className="w-full bg-transparent p-3 text-white outline-none ml-2" 
                                            placeholder="SMAN 1 Jakarta"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 mt-8">
                                <button 
                                    type="submit" disabled={saving}
                                    className="w-full md:w-auto px-8 py-3 bg-third text-bg font-bold rounded-xl hover:bg-[#4bc0cb] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-third/20 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    )
}