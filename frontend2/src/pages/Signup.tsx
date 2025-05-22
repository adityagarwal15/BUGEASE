
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2, MapPin, Phone } from 'lucide-react';
import { authService, RegisterCredentials } from '@/services/authService';

const Signup = () => {
  const [formData, setFormData] = useState<RegisterCredentials & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '', // Added phone number field
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerData } = formData;
        
        await authService.register(registerData);
        
        toast({
          title: "Account created successfully",
          description: "You can now log in with your new account",
        });
        
        navigate("/login");
      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle API error responses
        if (error.response?.data) {
          const apiErrors = error.response.data;
          const formattedErrors: Record<string, string> = {};
          
          // Format API errors to match our form fields
          Object.keys(apiErrors).forEach(key => {
            formattedErrors[key] = Array.isArray(apiErrors[key]) 
              ? apiErrors[key][0] 
              : apiErrors[key];
          });
          
          setErrors(formattedErrors);
        } else {
          toast({
            title: "Registration failed",
            description: error.message || "Something went wrong. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#1a1a2e] flex items-center justify-center p-4">
      {/* Background ambient effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/80 to-[#1a1a2e]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a] rounded-full p-2 shadow-[0_0_15px_rgba(127,90,240,0.5)]">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">CampusBuggy</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Create an account</h1>
          <p className="text-white/60">Join the campus mobility revolution</p>
        </div>
        
        <Card className="glass-panel border border-white/10 backdrop-blur-md bg-[#1a1a2e]/70 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-white">Sign Up</CardTitle>
              <CardDescription className="text-white/60">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium text-white">
                    First Name
                  </label>
                  <Input 
                    id="first_name"
                    name="first_name"
                    placeholder="John" 
                    className={`bg-white/5 border border-white/10 text-white ${errors.first_name ? "border-red-500" : ""}`}
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium text-white">
                    Last Name
                  </label>
                  <Input 
                    id="last_name"
                    name="last_name"
                    placeholder="Doe" 
                    className={`bg-white/5 border border-white/10 text-white ${errors.last_name ? "border-red-500" : ""}`}
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white">
                  Username
                </label>
                <Input 
                  id="username"
                  name="username"
                  placeholder="johndoe" 
                  className={`bg-white/5 border border-white/10 text-white ${errors.username ? "border-red-500" : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email (Optional)
                </label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com" 
                  className={`bg-white/5 border border-white/10 text-white ${errors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              
              {/* New Phone Number Field */}
              <div className="space-y-2">
                <label htmlFor="phone_number" className="text-sm font-medium text-white flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </label>
                <Input 
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="1234567890" 
                  className={`bg-white/5 border border-white/10 text-white ${errors.phone_number ? "border-red-500" : ""}`}
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength={10}
                />
                {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className={`bg-white/5 border border-white/10 text-white ${errors.password ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className={`bg-white/5 border border-white/10 text-white ${errors.confirmPassword ? "border-red-500" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <div className="text-center text-sm text-white/60">
                Already have an account?{" "}
                <Link to="/login" className="text-[#7f5af0] hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
