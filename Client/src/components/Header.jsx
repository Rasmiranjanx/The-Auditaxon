import React, { useState, useRef } from 'react'
import Navbar from './Navbar'
import { Calculator, FileText, TrendingUp, IndianRupee } from 'lucide-react'

const Header = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isActive, setIsActive] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
        setIsActive(true)

        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            setIsActive(false)
        }, 1000)
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className='min-h-screen mb-4 flex flex-col items-center justify-center w-full overflow-hidden gap-6 bg-black relative'
            id="home"
        >
            <div
                className='absolute inset-0'
                style={{
                    background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                }}
            ></div>

            <div
                className='absolute w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none transition-all ease-out'
                style={{
                    left: mousePos.x - 80,
                    top: mousePos.y - 80,
                    opacity: isActive ? 1 : 0,
                    transitionDuration: isActive ? '300ms' : '1500ms',
                }}
            ></div>

            <div className='absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-slate-800/40 to-transparent'></div>

            <Calculator className='absolute top-1/4 left-[10%] text-white/20 w-16 h-16 animate-float' />
            <FileText className='absolute top-1/3 right-[12%] text-white/20 w-14 h-14 animate-float-slow' />
            <TrendingUp className='absolute bottom-1/4 left-[15%] text-white/20 w-16 h-16 animate-float-slow' />
            <IndianRupee className='absolute bottom-1/3 right-[8%] text-white/20 w-14 h-14 animate-float' />

            <Navbar />

            <h1 className='text-white text-4xl md:text-6xl font-bold text-center px-6 relative z-10' style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Numbers you can trust, <br />
                guidance you can rely on.
            </h1>

            <a href="#contact" className='bg-white hover:bg-gray-200 transition text-black px-8 py-3 font-semibold relative z-10'>
                Contact Us
            </a>
        </div>
    )
}

export default Header