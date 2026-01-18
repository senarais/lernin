"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import ImageSlider from "../components/HeroSlider"
import Testimonials from "../components/Testimontials"

type NavigationItem = {
    title: string
    path: string
}

const Home = () => {
    return (
        <div className="w-full h-dvh bg-white">
            <Navbar/>
            <div className="w-full flex justify-center h-fit bg-linear-to-b from-third to-transparent rounded-b-4xl" >
                <div className="w-[90%] rounded-4xl mt-36">
                    <ImageSlider />
                </div>
            </div>

            <div className="w-full h-fit py-10 mt-10 font-sans flex flex-col items-center">
                <div className="">
                    <h2 className="text-4xl text-center font-medium">Mengapa memilih <span className="text-primary font-bold">Lernin?</span></h2>
                    <div className="w-[90%] mt-12 grid lg:grid-cols-2 grid-rows-2 gap-15 gap-x-40 justify-center items-center">
                        <div className="flex items-start gap-10 w-md">
                            <img className="w-auto h-auto" src="https://pahamify.com/wp-content/uploads/2022/06/icon-latihan.svg" alt="" />
                            <p><span className="font-semibold">Lorem ipsum dolor sit.</span><br />Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quisquam porro officiis sint quo vitae, animi voluptate perspiciatis ad veritatis, quis ea ut minus!</p>
                        </div>
                        <div className="flex items-start gap-10 w-md">
                            <img className="w-auto h-auto" src="https://pahamify.com/wp-content/uploads/2022/06/icon-latihan.svg" alt="" />
                            <p><span className="font-semibold">Lorem ipsum dolor sit.</span><br />Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quisquam porro officiis sint quo vitae, animi voluptate perspiciatis ad veritatis, quis ea ut minus!</p>
                        </div>
                        <div className="flex items-start gap-10 w-md">
                            <img className="w-auto h-auto" src="https://pahamify.com/wp-content/uploads/2022/06/icon-latihan.svg" alt="" />
                            <p><span className="font-semibold">Lorem ipsum dolor sit.</span><br />Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quisquam porro officiis sint quo vitae, animi voluptate perspiciatis ad veritatis, quis ea ut minus!</p>
                        </div>
                        <div className="flex items-start gap-10 w-md">
                            <img className="w-auto h-auto" src="https://pahamify.com/wp-content/uploads/2022/06/icon-latihan.svg" alt="" />
                            <p><span className="font-semibold">Lorem ipsum dolor sit.</span><br />Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quisquam porro officiis sint quo vitae, animi voluptate perspiciatis ad veritatis, quis ea ut minus!</p>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="w-full relative lg:top-30 md:top-20 top-10 flex justify-center items-stretch gap-2 md:gap-6 lg:gap-10 px-4 md:px-0">
            {/* Card 1 */}
            <div className="flex-1 max-w-[350px] bg-white p-3 md:p-6 flex flex-col gap-2 md:gap-4 justify-center items-center rounded-xl md:rounded-3xl border border-gray-300 text-center shadow-sm">
                <img
                className="w-12 md:w-20 lg:w-24 h-auto"
                src="https://myskill.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Falumny.ffd9ca6f.png&w=96&q=75"
                alt="Alumni Icon"
                />
                <div className="flex flex-col gap-1">
                <h3 className="text-xs md:text-lg font-bold text-gray-800 leading-tight">
                    Ribuan Alumni
                </h3>
                <p className="text-[10px] md:text-sm text-gray-600 leading-tight">
                    Telah lulus bootcamp
                </p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 max-w-[350px] bg-white p-3 md:p-6 flex flex-col gap-2 md:gap-4 justify-center items-center rounded-xl md:rounded-3xl border border-gray-300 text-center shadow-sm">
                <img
                className="w-12 md:w-20 lg:w-24 h-auto"
                src="https://myskill.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpractical.021f86b2.png&w=128&q=75"
                alt="PTN Icon"
                />
                <div className="flex flex-col gap-1">
                <h3 className="text-xs md:text-lg font-bold text-gray-800 leading-tight">
                    Diterima PTN
                </h3>
                <p className="text-[10px] md:text-sm text-gray-600 leading-tight">
                    Universitas ternama
                </p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="flex-1 max-w-[350px] bg-white p-3 md:p-6 flex flex-col gap-2 md:gap-4 justify-center items-center rounded-xl md:rounded-3xl border border-gray-300 text-center shadow-sm">
                <img
                className="w-12 md:w-20 lg:w-24 h-auto"
                src="https://myskill.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frating.e5e8227d.png&w=128&q=75"
                alt="Career Icon"
                />
                <div className="flex flex-col gap-1">
                <h3 className="text-xs md:text-lg font-bold text-gray-800 leading-tight">
                    Karir Cemerlang
                </h3>
                <p className="text-[10px] md:text-sm text-gray-600 leading-tight">
                    Di perusahaan top
                </p>
                </div>
            </div>
            </div>
            <div className="bg-gray-100 rounded-t-4xl pt-10 lg:pt-30">
                <Testimonials />
            </div>


        </div>
    )
}

export default Home
