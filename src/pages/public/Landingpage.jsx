import React from 'react'
import Navbar from '../../components/common/Navbar'
import HeroSection from '../../components/landing/HeroSection'
import HowItWorks from '../../components/landing/HowIsItSection'
import Footer from '../../components/landing/Footer'

export default function Landingpage() {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <Footer />
    </div>
  )
}
