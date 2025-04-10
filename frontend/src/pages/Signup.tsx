
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Set a dummy login state for demonstration
      localStorage.setItem("isLoggedIn", "true");
      
      // Simulate signup success
      toast({
        title: "Account created successfully",
        description: "Welcome to Campus Buggy Tracking System!"
      });
      
      navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-full p-2">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-glow">CampusBuggy</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-muted-foreground">Sign up to get started with campus transportation</p>
        </div>
        
        <Card className="glass-card">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create a student account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    placeholder="First Name" 
                    className={`input-field ${errors.firstName ? "border border-red-500" : ""}`}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name" 
                    className={`input-field ${errors.lastName ? "border border-red-500" : ""}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="yourname@example.com" 
                  className={`input-field ${errors.email ? "border border-red-500" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="userType" className="text-sm font-medium">
                  User Type
                </label>
                <div className="p-3 rounded-md bg-muted/50 border border-border text-sm">
                  <span className="text-muted-foreground">Student</span>
                  <p className="text-xs text-muted-foreground mt-1">All accounts created are student accounts. Driver accounts are created by admins only.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className={`input-field ${errors.password ? "border border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  className={`input-field ${errors.confirmPassword ? "border border-red-500" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      termsAccepted: checked === true
                    });
                    if (errors.termsAccepted) {
                      setErrors({ ...errors, termsAccepted: "" });
                    }
                  }} 
                />
                <label htmlFor="terms" className={`text-sm ${errors.termsAccepted ? "text-red-500" : "text-muted-foreground"}`}>
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Create Student Account
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
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
