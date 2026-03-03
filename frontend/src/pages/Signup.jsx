import React, { useState } from 'react'

import { Input } from "../components/ui/input";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

import { Label } from "../components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Background from "../assets/Background.jpeg"

const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ username: "", email: "", password: "" })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post("http://localhost:3000/user/register", formData, { headers: { "Content-Type": "application/json" } })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/verify')  // go to check email page
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative w-full min-h-screen">
            <div className="fixed inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${Background})` }}></div>
            <div className="fixed inset-0 bg-black/40 z-10"></div>
            <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md space-y-6 flex flex-col items-center">
                    <Card className="w-full max-w-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-green-600">Sign Up</CardTitle>
                            <CardDescription className="text-center">Create your account to get started with PDF generators</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Full Name</Label>
                                    <Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your full name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input id="password" name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Enter your password" required />
                                        <Button variant='ghost' size="sm" className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent' onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-500">
                                {isLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Creating account..</> : "Sign Up"}
                            </Button>
                            <div className="flex justify-center w-full text-sm items-center mt-2">
                                <span className="text-blue-950 mr-1">Already have an account?</span>
                                <Link to="/login" className="text-green-500 hover:underline">Login</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Signup