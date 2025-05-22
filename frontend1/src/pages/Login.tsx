
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth, LoginCredentials } from '@/services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added for password visibility toggle
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!credentials.username) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const result = await login(credentials);
        
        toast({
          title: "Login successful",
          description: `Welcome back! You are logged in as ${result.userType}`
        });
        
        // Redirect based on user type
        if (result.userType === 'driver') {
          navigate("/driver/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        // Error is handled by the useAuth hook
        console.error('Login failure:', error);
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
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome back</h1>
          <p className="text-white/60">Sign in to access your account</p>
        </div>
        
        <Card className="glass-panel border border-white/10 backdrop-blur-md bg-[#1a1a2e]/70 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-white">Sign In</CardTitle>
              <CardDescription className="text-white/60">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white">
                  Username
                </label>
                <div className="relative">
                  <Input 
                    id="username"
                    name="username"
                    placeholder="Your username" 
                    className={`bg-white/5 border border-white/10 text-white ${errors.username ? "border-red-500" : ""}`}
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
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
                    value={credentials.password}
                    onChange={handleChange}
                    required
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
              
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-[#00d1ff] hover:underline">
                  Forgot password?
                </Link>
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="text-center text-sm text-white/60">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#7f5af0] hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
