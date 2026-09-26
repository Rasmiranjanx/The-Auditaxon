import React from 'react'
import { Receipt, FileStack, ClipboardCheck, Building2, BookOpenText, LineChart } from 'lucide-react'

const services = [
    { icon: Receipt, title: "Direct Tax", description: "Income tax planning, filing, and advisory for individuals and businesses." },
    { icon: FileStack, title: "Indirect Tax / GST", description: "GST registration, return filing, and compliance management." },
    { icon: ClipboardCheck, title: "Audit & Assurance", description: "Statutory, internal, and tax audits conducted with precision." },
    { icon: Building2, title: "Company Registration", description: "End-to-end support for incorporating and structuring your business." },
    { icon: BookOpenText, title: "Bookkeeping", description: "Accurate, up-to-date books so you always know where you stand." },
    { icon: LineChart, title: "Financial Advisory", description: "Strategic guidance to help your business grow with confidence." },
]

const Services = () => {
    return (
        <div id="services" className='min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-white flex flex-col justify-center'>
            <div className='text-center mb-14'>
                <h2 className='text-3xl md:text-4xl font-bold text-slate-900' style={{ fontFamily: "'Playfair Display', serif" }}>
                    Our Services
                </h2>
                <p className='text-slate-500 mt-3 max-w-2xl mx-auto'>
                    Comprehensive financial and compliance solutions tailored to your business needs.
                </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {services.map((service, index) => {
                    const Icon = service.icon
                    return (
                        <div key={index} className='flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-lg transition'>
                            <div className='bg-slate-900 text-white p-4 rounded-full mb-4'>
                                <Icon size={28} />
                            </div>
                            <h3 className='font-semibold text-lg text-slate-900'>{service.title}</h3>
                            <p className='text-slate-500 text-sm mt-2'>{service.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Services