import React from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { teamMembers } from '../assets/assets'
import siteConfig from '../config/site'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { requestServiceConsultation } from '../lib/inquire'

const roleFocus = {
  1: 'Leading statutory audits, corporate taxation, and strategic financial governance.',
  2: 'Driving operational excellence, compliance workflows, and process precision.',
  3: 'Guiding enterprise onboarding, client partnerships, and business advisory.',
}

const Team = () => {
  return (
    <section id="team" className="section bg-ivory">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Our people"
            title="Meet Our Team"
            lead="The people behind The Auditaxon — experienced, dedicated, and here to help."
          />
        </Reveal>

        {/* Team Cards */}
        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6 md:mt-16 lg:gap-8">
          {teamMembers.map((person, index) => (
            <Reveal
              key={person.id}
              as="article"
              delay={index * 80}
              className="w-full max-w-sm sm:w-[calc((100%_-_1.5rem)/2)] sm:max-w-none lg:w-[calc((100%_-_4rem)/3)]"
            >
              <div className="group card-luxury flex h-full flex-col overflow-hidden">
                {/* Gallery-matted portrait frame */}
                <div className="relative border-b border-paper-edge bg-paper/70 p-2.5">
                  <div className="overflow-hidden border border-paper-edge/60 bg-paper">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="aspect-[4/5] w-full object-cover object-top mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-500 transition-transform duration-300 group-hover:scale-x-100"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-semibold text-ink">{person.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gold-700">{person.role}</p>

                  {roleFocus[person.id] && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {roleFocus[person.id]}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-paper-edge/70 pt-4">
                    <a
                      href={`mailto:${siteConfig.contact.primaryEmail}`}
                      aria-label={`Email the team at ${siteConfig.contact.primaryEmail}`}
                      title={siteConfig.contact.primaryEmail}
                      className="link inline-flex min-h-9 items-center gap-2 text-sm"
                    >
                      <Mail size={15} strokeWidth={1.75} className="shrink-0 text-gold-600" />
                      Email team
                    </a>

                    <button
                      type="button"
                      onClick={() => requestServiceConsultation(`Consultation with ${person.name}`)}
                      className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold tracking-wider text-slate-600 uppercase transition-colors hover:text-navy-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:outline-none"
                    >
                      Consult
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
