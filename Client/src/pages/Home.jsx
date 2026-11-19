import React from 'react'
import Header from '../components/Header'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Careers from '../components/careers'
import Testimonials from '../components/Testimonials'
import ReviewForm from '../components/ReviewForm'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Services />
      <Team />
      <Careers />
      <Testimonials />
      <Contact />
      <ReviewForm />

      <Footer />
    </>
  )
}

export default Home
