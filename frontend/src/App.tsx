
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TrackingMap from "./pages/TrackingMap";
import BookRide from "./pages/BookRide";
import RideHistory from "./pages/RideHistory";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Alerts from "./pages/Alerts"; 
import UsageStats from "./pages/UsageStats"; 
import Team from "./pages/Team";
import Footer from "./components/Footer";
import Faq from "./pages/Faq"; // New route
import Contact from "./pages/Contact"; // New route
import Privacy from "./pages/Privacy"; // New route
import Terms from "./pages/Terms"; // New route
import AdminAuth from "./components/AdminAuth"; // New admin authentication component
import { useEffect } from "react";

const queryClient = new QueryClient();

// Simulate authentication check (replace with actual auth check when connected to Supabase)
const isAuthenticated = () => {
  // This would be replaced with actual auth check
  return localStorage.getItem("isLoggedIn") === "true";
};

// Check if user is an admin
const isAdmin = () => {
  // This would be replaced with actual admin check
  return localStorage.getItem("isAdmin") === "true";
};

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Admin route component that redirects to dashboard if not an admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/admin-auth" />;
  }
  
  return <>{children}</>;
};

// Layout with Footer
const AppLayout = ({ children, includeFooter = true }: { children: React.ReactNode, includeFooter?: boolean }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      {includeFooter && <Footer />}
    </div>
  );
};

// ScrollToTop component - scrolls to the top when navigation changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Home page */}
            <Route path="/" element={
              <>
                <Index />
                <Footer />
              </>
            } />
            
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Authentication */}
            <Route path="/admin-auth" element={<AdminAuth />} />
            
            {/* Protected pages with navbar */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout includeFooter={false}>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tracking" element={
              <AppLayout includeFooter={false}>
                <TrackingMap />
              </AppLayout>
            } />
            
            <Route path="/book" element={
              <ProtectedRoute>
                <AppLayout>
                  <BookRide />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <AppLayout>
                  <RideHistory />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/alerts" element={
              <ProtectedRoute>
                <AppLayout>
                  <Alerts />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/stats" element={
              <ProtectedRoute>
                <AppLayout>
                  <UsageStats />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin-only route */}
            <Route path="/admin" element={
              <AdminRoute>
                <AppLayout includeFooter={false}>
                  <AdminPanel />
                </AppLayout>
              </AdminRoute>
            } />
            
            {/* Public pages */}
            <Route path="/about" element={
              <AppLayout>
                <About />
              </AppLayout>
            } />
            
            <Route path="/gallery" element={
              <AppLayout>
                <Gallery />
              </AppLayout>
            } />
            
            <Route path="/team" element={
              <AppLayout>
                <Team />
              </AppLayout>
            } />
            
            {/* New pages */}
            <Route path="/faq" element={
              <AppLayout>
                <Faq />
              </AppLayout>
            } />
            
            <Route path="/contact" element={
              <AppLayout>
                <Contact />
              </AppLayout>
            } />
            
            <Route path="/privacy" element={
              <AppLayout>
                <Privacy />
              </AppLayout>
            } />
            
            <Route path="/terms" element={
              <AppLayout>
                <Terms />
              </AppLayout>
            } />
            
            {/* Not found page */}
            <Route path="*" element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
