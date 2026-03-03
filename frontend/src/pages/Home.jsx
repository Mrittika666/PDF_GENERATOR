import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to PDF Generator</h1>
            <Link to="/signup" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500">
                Go to Sign Up
            </Link>
        </div>
    </div>
)

export default Home