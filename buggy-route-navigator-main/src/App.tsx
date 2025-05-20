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
import Faq from "./pages/Faq"; 
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminAuth from "./components/AdminAuth";
import { useEffect } from "react";
import { authService } from "./services/authService";
import ChatbotLoader from "./components/ChatbotLoader";

// Import driver pages
import DriverDashboard from "./pages/driver/Dashboard";
import DriverProfile from "./pages/driver/Profile";
import DriverFaq from "./pages/driver/Faq";

const queryClient = new QueryClient();

// Check if user is authenticated
const isAuthenticated = () => {
  return authService.isAuthenticated();
};

// Check if user is an admin
const isAdmin = () => {
  // This would be replaced with actual admin check
  return localStorage.getItem("isAdmin") === "true";
};

// Check if user is a driver
const isDriver = () => {
  return authService.isDriver();
};

// Check if user is a student
const isStudent = () => {
  return authService.isStudent();
};

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Driver route component that redirects to login if not a driver
const DriverRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isDriver()) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Student route component that redirects to login if not a student
const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isStudent()) {
    return <Navigate to="/driver/dashboard" />;
  }
  
  return <>{children}</>;
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
            
            {/* Student protected pages with navbar */}
            <Route path="/dashboard" element={
              <StudentRoute>
                <AppLayout includeFooter={false}>
                  <Dashboard />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/tracking" element={
              <AppLayout includeFooter={false}>
                <TrackingMap />
              </AppLayout>
            } />
            
            <Route path="/book" element={
              <StudentRoute>
                <AppLayout>
                  <BookRide />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/history" element={
              <StudentRoute>
                <AppLayout>
                  <RideHistory />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/profile" element={
              <StudentRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/notifications" element={
              <StudentRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/alerts" element={
              <StudentRoute>
                <AppLayout>
                  <Alerts />
                </AppLayout>
              </StudentRoute>
            } />
            
            <Route path="/stats" element={
              <StudentRoute>
                <AppLayout>
                  <UsageStats />
                </AppLayout>
              </StudentRoute>
            } />
            
            {/* Driver pages */}
            <Route path="/driver/dashboard" element={
              <DriverRoute>
                <AppLayout includeFooter={false}>
                  <DriverDashboard />
                </AppLayout>
              </DriverRoute>
            } />
            
            <Route path="/driver/profile" element={
              <DriverRoute>
                <AppLayout>
                  <DriverProfile />
                </AppLayout>
              </DriverRoute>
            } />
            
            <Route path="/driver/faq" element={
              <DriverRoute>
                <AppLayout>
                  <DriverFaq />
                </AppLayout>
              </DriverRoute>
            } />
            
            <Route path="/driver/notifications" element={
              <DriverRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </DriverRoute>
            } />
            
            <Route path="/driver/alerts" element={
              <DriverRoute>
                <AppLayout>
                  <Alerts />
                </AppLayout>
              </DriverRoute>
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
          <ChatbotLoader />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
