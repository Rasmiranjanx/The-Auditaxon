import React from 'react'
import { teamMembers } from '../assets/assets'
import { Mail } from 'lucide-react'

const Team = () => {

    
    const teamInfo = [
    {
        name: 'Prabhu Kalyan Mohanty',
        role: 'Founder & Managing Partner',
    },
    {
        name: 'Rakesh Dash',
        role: 'Partner, Operations & Strategy',
    },
    {
        name: 'Jyoti Prakash Baral',
        role: 'Partner, Business Development',
    },
]

    return (
        <div
            id="team"
            className='min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-black flex flex-col justify-center relative overflow-hidden'
        >

            {/* Background Gradient */}
            <div
                className='absolute inset-0'
                style={{
                    background:
                        'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                }}
            ></div>

            {/* Background Glow */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-white/10 rounded-full blur-3xl'></div>

            <div className='relative z-10'>

                {/* Heading */}
                <div className='text-center mb-14'>
                    <h2
                        className='text-3xl md:text-4xl font-bold text-white'
                        style={{
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        Meet Our Team
                    </h2>

                    <p className='text-slate-400 mt-3 max-w-2xl mx-auto'>
                        The people behind The Auditaxon — experienced,
                        dedicated, and here to help.
                    </p>
                </div>

                {/* Team Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

                    {teamMembers.map((member, index) => {

                        const person = teamInfo[index]

                        return (
                            <div
                                key={member.id}
                                className='flex flex-col items-center text-center p-8 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition'
                            >

                                {/* Photo */}
                                <img
                                    src={member.photo}
                                    alt={person.name}
                                    className='w-40 h-40 rounded-full object-cover mb-5 border border-white/20'
                                />

                                {/* Name */}
                                <h3 className='font-semibold text-xl text-white'>
                                    {person.name}
                                </h3>

                                {/* Role */}
                                <p className='text-slate-400 text-sm mb-4'>
                                    {person.role}
                                </p>

                                {/* Contact Details */}
                                <div className='flex flex-col gap-2 text-sm text-slate-400'>

                                    {/* Same Email for Everyone */}
                                    <span className='flex items-center gap-2 justify-center'>
                                        <Mail size={14} />
                                        theauditaxon@gmail.com
                                    </span>

                                </div>

                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default Team