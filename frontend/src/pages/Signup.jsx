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
import BASE_URL from '../config'

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
        console.log("FORM DATA:", formData);
        try {
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}/user/register`, formData, {
                headers: { "Content-Type": "application/json" }
              })
                toast.success(res.data.message)
                navigate('/verify')  // go to check email page
            }
         catch (error) {
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
                        <form onSubmit={handleSubmit}>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Full Name</Label>
                                        <Input name="username" value={formData.username} onChange={handleChange} required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Password</Label>
                                        <Input name="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button type="submit" className="w-full bg-green-600">
                                    Sign Up
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Signup