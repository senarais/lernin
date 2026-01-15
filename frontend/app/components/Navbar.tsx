"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

type NavigationItem = {
    title: string
    path: string
}

const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false)

    const navigation: NavigationItem[] = [
        { title: "E-Learning", path: "/course" },
        { title: "Live Class", path: "/integrations" },
        { title: "Tryout", path: "/customers" },
        { title: "Tracker", path: "/pricing" }
    ]

    return (
        <nav className="fixed font-semibold w-full md:text-sm pt-4">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/lernin.png"
                            width={120}
                            height={50}
                            alt="Float UI logo"
                        />
                    </Link>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            className="text-gray-500 hover:text-gray-800"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div
                    className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                        open ? "block" : "hidden"
                    }`}
                >
                    <ul className="justify-end font-sans items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {navigation.map((item) => (
                            <li
                                key={item.title}
                                className="text-gray-700 hover:text-indigo-600"
                            >
                                <Link href={item.path} className="block">
                                    {item.title}
                                </Link>
                            </li>
                        ))}

                        <span className="hidden w-px h-6 bg-black md:block" />

                        <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
                            <li>
                                <Link
                                    href="/login"
                                    className="block py-3 text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow md:inline"
                                >
                                    Sign up
                                </Link>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
