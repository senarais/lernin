"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import ImageSlider from "../components/HeroSlider"
import Testimonials from "../components/Testimontials"
import FaqSection from "../components/Faq"
import Footer from "../components/Footer"

type NavigationItem = {
    title: string
    path: string
}

const Home = () => {
    return (
        <div className="w-full h-dvh flex flex-col items-center bg-bg text-white overflow-x-hidden">
            <Navbar/>
            {/* Hero Section */}
            <section className="relative w-[90%] h-fit flex justify-center items-center py-10">
                <div className="max-w-[500px] z-10 flex flex-col gap-10">
                    <h1 className="font-semibold text-4xl">Bimbingan Belajar UTBK untuk bantu kamu lolos <br /> <span className="text-third">PTN </span><span className="text-secondary">IMPIAN</span></h1>
                    <p className="text-2xl font-extralight">Tingkatkan Kemampuan di Lingkungan Profesional dan Raih Kesuksesan!</p>
                    <a className="w-42 rounded-3xl flex items-center justify-center h-12 border border-secondary text-sm" href="/course">Coba Sekarang <img className="ml-2" src="/landing/vector.svg" alt="" /></a>
                </div>
                <img className="z-10" src="/landing/hero.png" alt="hero image" />
                <div className="absolute w-120 h-120 bg-third/40 blur-3xl -right-80 bottom-0 rounded-full z-1"></div>
                <div className="absolute w-120 h-120 bg-third/40 blur-3xl -left-80  rounded-full z-1"></div>
            </section>

            {/* IPA Section */}
            <section className="relative w-[90%] h-fit flex justify-center items-center gap-20 py-30">
                <img className="w-auto h-auto max-w-125" src="/landing/ipa.svg" alt="Ipa" />
                <div className="max-w-[480px] z-10 flex flex-col gap-10">
                    <h2 className="font-semibold text-4xl">Matapelajaran Dalam Jurusan IPA</h2>
                    <p className="text-[18px] font-extralight">WooCommerce is developer friendly, too. Built with a REST API, WooCommerce is scalable and can integrate with virtually any service. Design a complex store from scratch, extend a store for a client, or simply add a single product to a WordPress site—your store, your way.</p>
                    <a className="w-65 rounded-4xl flex items-center justify-center h-16 bg-primary text-white text-[18px]" href="/course">Materi Selengkapnya</a>
                </div>
                <div className="absolute w-120 h-120 bg-third/40 blur-3xl -right-60 rounded-full z-1"></div>
            </section>


            {/* IPS Section */}
            <section className="relative w-[90%] h-fit flex justify-center items-center gap-20 py-30">
                <div className="max-w-[480px] z-10 flex flex-col gap-10">
                    <h2 className="font-semibold text-4xl">Matapelajaran Dalam Jurusan IPS</h2>
                    <p className="text-[18px] font-extralight">WooCommerce is one of the fastest-growing eCommerce communities. We’re proud that the helpfulness of the community and a wealth of online resources are frequently cited as reasons our users love it. There are 80+ meetups worldwide!</p>
                    <a className="w-65 rounded-4xl flex items-center justify-center h-16 bg-primary text-white text-[18px]" href="/course">Materi Selengkapnya</a>
                </div>
                <img className="w-auto h-auto max-w-125 z-10" src="/landing/ips.svg" alt="Ipa" />
                <div className="absolute w-120 h-120 bg-third/40 blur-3xl -left-60 rounded-full z-1"></div>
            </section>

            {/* Pricing Section */}
            <section className="relative w-[90%] h-fit flex flex-col justify-center items-center gap-20 py-10">
                <div className="w-full text-[50px]">
                    <h2 className="font-extralight">Transparent pricing for <br /><span className="font-bold">every solution</span></h2>
                </div>
                <div className="w-full flex justify-between">
                    <div className="w-90 h-125 bg-[#5B5B5B]/20 p-10 justify-evenly rounded-4xl flex flex-col gap-10">
                        <div>
                            <p className="font-bold text-5xl text-third">Rp. 19.000</p>
                            <p className="text-lg">Durasi 1 bulan</p>
                        </div>
                        <ul className="list-none flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            
                        </ul>
                        <a className="w-38 h-12 border border-third rounded-xl flex justify-center items-center text-lg" href="">Beli Paket</a>
                    </div>
                    <div className="w-90 h-125 bg-[#5B5B5B]/20 p-10 justify-evenly rounded-4xl flex flex-col gap-10">
                        <div>
                            <p className="font-bold text-5xl text-third">Rp. 19.000</p>
                            <p className="text-lg">Durasi 1 bulan</p>
                        </div>
                        <ul className="list-none flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            
                        </ul>
                        <a className="w-38 h-12 border border-third rounded-xl flex justify-center items-center text-lg" href="">Beli Paket</a>
                    </div>
                    <div className="w-90 h-125 bg-[#5B5B5B]/20 p-10 justify-evenly rounded-4xl flex flex-col gap-10">
                        <div>
                            <p className="font-bold text-5xl text-third">Rp. 19.000</p>
                            <p className="text-lg">Durasi 1 bulan</p>
                        </div>
                        <ul className="list-none flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <img src="/landing/check.svg" alt="check" className="w-5 h-5" />
                                <span>Akses penuh semua fitur</span>
                            </li>
                            
                        </ul>
                        <a className="w-38 h-12 border border-third rounded-xl flex justify-center items-center text-lg" href="">Beli Paket</a>
                    </div>
                </div>
            </section>


            <div className="rounded-t-4xl ">
                <FaqSection />
            </div>

            <Footer />


        </div>
    )
}

export default Home
