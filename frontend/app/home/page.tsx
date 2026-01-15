"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import ImageSlider from "../components/HeroSlider"

type NavigationItem = {
    title: string
    path: string
}

const Home = () => {
    return (
        <div className="w-full h-dvh bg-white">
            <Navbar/>
            <div className="w-full flex justify-center h-[630px] bg-linear-to-b from-third to-transparent rounded-b-4xl" >
                <div className="w-[90%] rounded-4xl mt-36">
                    <ImageSlider />
                </div>
            </div>
        </div>
    )
}

export default Home
