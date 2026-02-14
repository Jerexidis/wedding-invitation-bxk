import React from 'react'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Events from './components/Events'
import Details from './components/Details'
import Gallery from './components/Gallery'
import Gifts from './components/Gifts'
import RSVP from './components/RSVP'
import Footer from './components/Footer'

function App() {
    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-primary/30">
            <Hero />
            <Countdown />
            <Events />
            <Details />
            <Gallery />
            <Gifts />
            <RSVP />
            <Footer />
        </div>
    )
}

export default App
