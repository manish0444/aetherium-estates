import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Check if the route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isManagerRoute = location.pathname.startsWith('/manager');

  // Redirect if trying to access admin routes without proper role
  if (isAdminRoute && currentUser?.role !== 'admin') {
    return <Navigate to='/' />;
  }

  // Redirect if trying to access manager routes without proper role
  if (isManagerRoute && currentUser?.role !== 'manager' && currentUser?.role !== 'admin') {
    return <Navigate to='/' />;
  }

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
