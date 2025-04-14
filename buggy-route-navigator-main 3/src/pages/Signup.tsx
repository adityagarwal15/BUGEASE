
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Loader2, Eye, EyeOff, Phone } from 'lucide-react'; // Added Phone icon
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, RegisterCredentials } from '@/services/authService';

const Signup = () => {
  const [formData, setFormData] = useState<RegisterCredentials & {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Create a username from first and last name if not provided
        const username = formData.username || `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`;
        
        await register({
          username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName, // Map firstName to first_name
          last_name: formData.lastName,   // Map lastName to last_name
          phone_number: formData.phoneNumber // Map phoneNumber to phone_number
        });
        
        toast({
          title: "Account created successfully",
          description: "Welcome to Campus Buggy Tracking System!"
        });
        
        navigate("/dashboard");
      } catch (error) {
        // Error is handled by the useAuth hook
        console.error('Registration failure:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input 
                  id="username"
                  name="username"
                  placeholder="Choose a username" 
                  className={`input-field ${errors.username ? "border border-red-500" : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
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
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <Input 
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter 10-digit phone number"
                  className={`input-field ${errors.phoneNumber ? "border border-red-500" : ""}`}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
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
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className={`input-field ${errors.password ? "border border-red-500" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className={`input-field ${errors.confirmPassword ? "border border-red-500" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                  disabled={isLoading}
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
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Student Account"
                )}
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
