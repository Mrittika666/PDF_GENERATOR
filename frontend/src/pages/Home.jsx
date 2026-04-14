import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <div className="home-wrapper">
            <div className="home-grid" />
            <div className="home-orb home-orb-1" />
            <div className="home-orb home-orb-2" />
            <div className="home-orb home-orb-3" />
            <div className="home-orb home-orb-4" />
            <div className="home-orb home-orb-5" />

            <div className={`home-card ${mounted ? 'visible' : ''}`}>
                <div className="home-icon">📄</div>
                <div className="home-badge">✦ Free to use ✦</div>
                <h1 className="home-title">
                    PDF <span>Generator</span>
                </h1>
                <p className="home-subtitle">Create beautiful documents in seconds.</p>
                <div className="home-buttons">
                    <Link to="/signup" className="btn-primary">Get Started →</Link>
                    <Link to="/login" className="btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Home