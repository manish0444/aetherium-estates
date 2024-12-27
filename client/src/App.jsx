import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/publicPages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import About from "./pages/publicPages/About";
import Profile from "./pages/privatePages/Profile";
import Header from "./components/Header";
import LandingHeader from "./components/LandingHeader";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/privatePages/CreateListing";
import UpdateListing from "./pages/privatePages/UpdateListing";
import Listings from "./pages/publicPages/Listings";
import Search from "./pages/publicPages/Search";
import Settings from "./pages/privatePages/Settings";
import Dashboard from "./pages/admin/Dashboard";
import AllListings from "./pages/privatePages/AllListings";
import ContactPage from "./pages/publicPages/Contact";
import TermsAndConditions from "./pages/publicPages/TermsConditions";
import PrivacyPolicy from "./pages/publicPages/Policy";
import FAQPage from "./pages/publicPages/Faq";
import BlogPage from "./pages/publicPages/Blog";
import ResetPassword from "./pages/auth/ResetPassword";
import AgentsPage from "./pages/publicPages/Agents";
import NotFound from "./pages/publicPages/Error";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Favorites from "./pages/publicPages/Favorites";
import ListingsPage from "./pages/admin/Pages/AllListings";
import UsersPage from "./pages/admin/Pages/AllUser";
import BlogAdminPage from "./pages/admin/Pages/CreateBlog";
import UserProfile from "./pages/publicPages/UserProfile";
import Footer from "./components/Footer";
import AdminCreateListing from "./pages/admin/Pages/CreateListing";
import UserProfilePage from "./pages/publicPages/UserProfilePage";
import { FavoritesProvider } from './context/FavoritesContext';
import ReviewListings from "./pages/admin/Pages/ReviewListings";
import ManagerDashboard from "./pages/manager/Dashboard";
import LandingPage from "./pages/publicPages/LandingPage";
import Solutions from "./pages/publicPages/Solutions";
import Features from "./pages/publicPages/Features";
import Pricing from "./pages/publicPages/Pricing";
import VirtualTour from "./pages/publicPages/VirtualTour";

// Admin route wrapper - redirects non-admins to home
const AdminRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Manager route wrapper
const ManagerRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser || (currentUser.role !== "manager" && currentUser.role !== "admin")) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const lastPathRef = React.useRef(location.pathname);

  useEffect(() => {
    const noReloadRoutes = ["/sign-in", "/sign-up", "/admin"];
    
    const shouldSkipReload = (path) => {
      return noReloadRoutes.some((route) => path.startsWith(route));
    };

    if (
      location.pathname !== lastPathRef.current &&
      !shouldSkipReload(location.pathname) &&
      !shouldSkipReload(lastPathRef.current)
    ) {
      lastPathRef.current = location.pathname;
      window.location.replace(window.location.href);
    }
  }, [location.pathname]);

  // Don't show header/footer for admin routes and auth pages
  const hideHeader = [
    "/sign-in", 
    "/sign-up", 
    "/verify-email", 
    "/admin",
    "/manager"
  ].includes(location.pathname);

  // Check if current route is a landing page
  const isLandingPage = [
    "/about",
    "/solutions",
    "/features",
    "/pricing"
  ].includes(location.pathname);

  const showFooter = ["/", "/contact", "/blog", "/faq"].includes(location.pathname) && !isLandingPage;

  return (
    <>
      {!hideHeader && !isLandingPage && <Header />}
      {isLandingPage && <LandingHeader />}
      <FavoritesProvider>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/all-listings"
            element={
              <AdminRoute>
                <ListingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/all-users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create-blog"
            element={
              <AdminRoute>
                <BlogAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <AdminRoute>
                <AdminCreateListing />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/review-listings"
            element={
              <AdminRoute>
                <ReviewListings />
              </AdminRoute>
            }
          />

          {/* Manager routes */}
          <Route
            path="/manager"
            element={
              <ManagerRoute>
                <ManagerDashboard />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <ManagerRoute>
                <ManagerDashboard />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/create"
            element={
              <ManagerRoute>
                <AdminCreateListing />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/create-blog"
            element={
              <ManagerRoute>
                <BlogAdminPage />
              </ManagerRoute>
            }
          />

          {/* Authentication routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password/:resetPasswordToken" element={<ResetPassword />} />

          {/* Landing Pages */}
          <Route path="/about" element={<LandingPage />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/listing/:listingId" element={<Listings />} />
          <Route path="/user-profile/:userId" element={<UserProfilePage />} />
          <Route path="/virtual-tour/:listingId" element={<VirtualTour />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-listings" element={<AllListings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/user-profile" element={<UserProfile />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FavoritesProvider>
      {showFooter && <Footer />}
    </>
  );
}

export default function MainApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}