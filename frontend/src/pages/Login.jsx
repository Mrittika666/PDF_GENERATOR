import React, { useState } from 'react'
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Background from "../assets/Background.jpeg"

const Login = ({ setUser }) => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: "", password: "" })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:3000/user/login",
                formData
            );

            console.log("LOGIN RESPONSE:", res.data);

            if (res.data.success) {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("userData", JSON.stringify(res.data.user));

                setUser(res.data.user);

                toast.success("Login Success!");

                navigate("/dashboard");
              }

        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen">
            <div className="fixed inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${Background})` }}></div>
            <div className="fixed inset-0 bg-black/40 z-10"></div>
            <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md space-y-6 flex flex-col items-center">
                    <Card className="w-full max-w-sm">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl text-green-600">Login</CardTitle>
                            <CardDescription>Login to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link to="/forgot-password" className="text-sm text-blue-950 hover:underline">Forgot Password?</Link>
                                    </div>
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
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in..</> : "Login"}
                            </Button>
                            <div className="flex justify-center w-full text-sm mt-2">
                                <span className="text-blue-950 mr-1">Don't have an account?</span>
                                <Link to="/signup" className="text-green-500 hover:underline">Sign Up</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Login