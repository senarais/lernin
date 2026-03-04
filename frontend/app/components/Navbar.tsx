"use client"
import { API_BASE_URL } from '@/lib/api'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

type NavigationItem = {
  title: string
  path: string
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const navigation: NavigationItem[] = [
      { title: "E-Learning", path: "/course" },
      { title: "Live Class", path: "/live-class" },
      { title: "Tryout", path: "/tryout" },
      { title: "My Class", path: "/live-class/my-class" }
  ]

  useEffect(() => {
      const handleScroll = () => {
          setScrolled(window.scrollY > 50)
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
      const checkAuth = async () => {
          try {
              const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' })
              const json = await res.json()
              if (json.user) setUser(json.user)
          } catch (e) { console.error(e) }
      }
      checkAuth()
  }, [])

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setDropdownOpen(false)
          }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
      try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
          setUser(null)
          router.push('/login')
          router.refresh()
      } catch (e) { console.error(e) }
  }

    return (
        <nav
            className={`block py-4 top-0 w-full z-50 transition-all duration-300
            ${scrolled ? "bg-transparent shadow-md text-white" : "bg-transparent text-white"}`}
        >
            <div className="items-center px-4 max-w-6xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5">
                    <Link href="/" className="flex items-center">
                        <Image src="/lernin.png" width={120} height={50} alt="Lernin logo" priority />
                    </Link>

                    <div className="md:hidden">
                        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
                            {open ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${open ? "block" : "hidden"}`}>
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {navigation.map((item) => (
                            <li key={item.title}>
                                <Link href={item.path} className="block hover:text-third transition-colors">
                                    {item.title}
                                </Link>
                            </li>
                        ))}

                        <span className="hidden w-px h-6 bg-gray-600 md:block" />

                        <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0 relative" ref={dropdownRef}>
                            {user ? (
                                <li>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 py-2 px-4 rounded-lg md:border-none w-full md:w-auto cursor-pointer bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-third text-bg font-bold flex items-center justify-center text-xs">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{user.username}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col">
                                            {user.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-sm font-medium text-white hover:bg-white/5 text-left border-b border-white/5 flex items-center gap-2">
                                                    Dashboard Admin
                                                </Link>
                                            )}
                                            <Link href="/profile" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-sm font-medium text-white hover:bg-white/5 text-left">
                                                View Profile
                                            </Link>
                                            <button onClick={handleLogout} className="px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 text-left border-t border-white/5">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className="block py-3 px-6 text-center text-white border border-white/20 hover:border-third hover:text-third transition-colors rounded-lg w-full md:w-auto">
                                            Log in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/register" className="block py-3 px-6 font-medium text-center text-bg bg-third hover:bg-[#4bc0cb] transition-colors rounded-lg w-full md:w-auto">
                                            Sign up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar