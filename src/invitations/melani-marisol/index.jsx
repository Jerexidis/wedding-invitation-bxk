import React from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Padrinos from './components/Padrinos'
import Countdown from './components/Countdown'
import Events from './components/Events'
import DressCode from './components/DressCode'
import Gallery from './components/Gallery'
import Gifts from './components/Gifts'
import Itinerary from './components/Itinerary'
import RSVP from './components/RSVP'
import Footer from './components/Footer'

function MelaniMarisol() {
    return (
        <div className="min-h-screen bg-rana-cream text-rana-text font-sans selection:bg-rana-primary/30 overflow-x-hidden">
            <Hero />
            <Intro />
            <Padrinos />
            <Countdown />
            <Events />
            <DressCode />
            <Gallery />
            <Gifts />
            <Itinerary />
            <RSVP />
            <Footer />
        </div>
    )
}

export default MelaniMarisol
