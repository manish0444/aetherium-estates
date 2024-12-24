import { Routes, Route } from 'react-router-dom';
import AllListings from './Pages/AllListings';
import CreateListing from './Pages/CreateListing';
import { SidebarProvider } from './context/SidebarContext';
import Dashboard from './Dashboard';
import UsersPage from './Pages/AllUser';

function Admin() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-listings" element={<AllListings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/all-users" element={<UsersPage />} />
      </Routes>
    </SidebarProvider>
  );
}

export default Admin;