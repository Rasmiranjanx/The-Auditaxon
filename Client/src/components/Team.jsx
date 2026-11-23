import React from 'react'
import { teamMembers } from '../assets/assets'
import { Mail } from 'lucide-react'
import siteConfig from '../config/site'
import SectionHeader from './ui/SectionHeader'

const Team = () => {
  return (
    <section id="team" className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Our people"
          title="Meet Our Team"
          lead="The people behind The Auditaxon — experienced, dedicated, and here to help."
        />

        {/* Team Cards */}
        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6 md:mt-16 lg:gap-8">
          {teamMembers.map((person) => {
            return (
              <article
                key={person.id}
                className="card w-full max-w-sm overflow-hidden sm:w-[calc((100%_-_1.5rem)/2)] sm:max-w-none lg:w-[calc((100%_-_4rem)/3)]"
              >
                {/* Photo: the portraits are shot on white, so multiply them onto a warm backdrop */}
                <div className="border-b border-paper-edge bg-paper">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="aspect-[4/5] w-full object-cover object-top mix-blend-multiply"
                  />
                </div>

                <div className="p-6">
                  {/* Name */}
                  <h3 className="font-display text-xl font-semibold text-ink">{person.name}</h3>

                  {/* Role */}
                  <p className="mt-1 text-sm font-medium text-gold-700">{person.role}</p>

                  {/* Contact Details: same firm inbox for everyone, so label it as such */}
                  <a
                    href={`mailto:${siteConfig.contact.primaryEmail}`}
                    aria-label={`Email the team at ${siteConfig.contact.primaryEmail}`}
                    title={siteConfig.contact.primaryEmail}
                    className="link mt-3 inline-flex min-h-10 items-center gap-2 text-sm"
                  >
                    <Mail size={16} strokeWidth={1.75} className="shrink-0 text-gold-600" />
                    Email the team
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Team
