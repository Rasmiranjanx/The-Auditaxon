import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactMessagesPanel from '../components/admin/ContactMessagesPanel'
import ApplicationsPanel from '../components/admin/ApplicationsPanel'
import ReviewsPanel from '../components/admin/ReviewsPanel'
import ContentPanel from '../components/admin/ContentPanel'
import TeamPanel from '../components/admin/TeamPanel'

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('messages')
    const navigate = useNavigate()
    const adminName = localStorage.getItem('adminName') || 'Admin'

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminName')
        navigate('/login')
    }

    const tabs = [
        { id: 'messages', label: 'Messages' },
        { id: 'applications', label: 'Applications' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'content', label: 'Content' },
        { id: 'team', label: 'Team' },
    ]

    return (
        <div className='min-h-screen bg-black flex'>
            <aside className='w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col p-6'>
                <h2 className='text-white font-bold text-lg mb-1' style={{ fontFamily: "'Playfair Display', serif" }}>
                    The Audit Axon
                </h2>
                <p className='text-slate-400 text-sm mb-8'>Welcome, {adminName}</p>

                <nav className='flex flex-col gap-2 flex-1'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-left px-4 py-2 rounded-lg transition ${
                                activeTab === tab.id
                                    ? 'bg-white text-black font-semibold'
                                    : 'text-slate-300 hover:bg-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className='text-red-400 hover:text-red-300 transition text-sm text-left mt-4'
                >
                    Logout
                </button>
            </aside>

            <main className='flex-1 p-8 overflow-y-auto'>
                {activeTab === 'messages' && <ContactMessagesPanel />}
                {activeTab === 'applications' && <ApplicationsPanel />}
                {activeTab === 'reviews' && <ReviewsPanel />}
                {activeTab === 'content' && <ContentPanel />}
                {activeTab === 'team' && <TeamPanel />}
            </main>
        </div>
    )
}

export default Dashboard