
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Loader2 } from 'lucide-react';
import { useAuth, LoginCredentials } from '@/services/authService';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(credentials);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Campus Buggy Tracking System!"
      });
      
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error('Login failure:', error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        
        <Card className="glass-card">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input 
                  id="username" 
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="your_username" 
                  className="input-field"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/reset-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  name="password" 
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="input-field"
                  required
                  disabled={isLoading}
                />
              </div>
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
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
