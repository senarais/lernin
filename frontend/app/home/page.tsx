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
            <div className="bg-gray-50">
                <Testimonials />
            </div>


        </div>
    )
}

export default Home
