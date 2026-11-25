import React from 'react'
import Header from '../components/Header'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import ApproachFAQ from '../components/ApproachFAQ'
import Careers from '../components/careers'
import Testimonials from '../components/Testimonials'
import ReviewForm from '../components/ReviewForm'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import BackToTop from '../components/ui/BackToTop'

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <About />
        <Services />
        <Team />
        <ApproachFAQ />
        <Testimonials />
        <ReviewForm />
        <Careers />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default Home
