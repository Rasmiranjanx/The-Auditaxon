import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, Inbox, LogOut, Star, UserRound, Users } from 'lucide-react'
import BrandMark from '../components/ui/BrandMark'
import ContactMessagesPanel from '../components/admin/ContactMessagesPanel'
import ApplicationsPanel from '../components/admin/ApplicationsPanel'
import ReviewsPanel from '../components/admin/ReviewsPanel'
import ContentPanel from '../components/admin/ContentPanel'
import TeamPanel from '../components/admin/TeamPanel'

// Icon shown beside each tab label, keyed by tab id (presentational only)
const tabIcons = {
  messages: Inbox,
  applications: Briefcase,
  reviews: Star,
  content: FileText,
  team: Users,
}

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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden sm:flex">
              <BrandMark />
            </span>
            <span className="flex sm:hidden">
              <BrandMark showWordmark={false} />
            </span>
            <span aria-hidden="true" className="hidden h-6 w-px bg-slate-200 sm:block" />
            <span className="badge badge-navy">Admin</span>
          </div>

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <p className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
              <span
                aria-hidden="true"
                className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 ring-1 ring-navy-100 sm:inline-flex"
              >
                <UserRound size={16} strokeWidth={1.75} />
              </span>
              <span className="truncate">
                <span className="hidden lg:inline">Signed in as </span>
                <span className="font-medium text-ink">{adminName}</span>
              </span>
            </p>
            <button onClick={handleLogout} className="btn btn-outline btn-sm h-10 shrink-0 lg:h-9">
              <LogOut size={14} aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Management Panel
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
          Messages, applications, reviews, website content and team profiles, managed in one place.
        </p>

        <nav
          aria-label="Management sections"
          className="-mx-5 mt-6 overflow-x-auto px-5 sm:mx-0 sm:px-0"
        >
          <div className="inline-flex min-w-max gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.id]
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4 ${
                    activeTab === tab.id
                      ? 'bg-navy-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="mt-6">
          {activeTab === 'messages' && <ContactMessagesPanel />}
          {activeTab === 'applications' && <ApplicationsPanel />}
          {activeTab === 'reviews' && <ReviewsPanel />}
          {activeTab === 'content' && <ContentPanel />}
          {activeTab === 'team' && <TeamPanel />}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
