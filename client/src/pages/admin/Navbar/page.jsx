import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  FileText,
  PlusSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard,
  Building,
  Settings,
  Search,
  Heart,
  ClipboardCheck
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { RoleBadge } from '../../../components/RoleBadge';
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../../../redux/user/userSlice.js";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Define menu items based on user role
  const getMenuItems = (role) => {
    const allMenuItems = [
      { 
        icon: <Home size={20} />, 
        text: "Dashboard", 
        link: role === 'admin' ? "/admin/dashboard" : "/manager/dashboard",
        roles: ['admin', 'manager'] 
      },
      { 
        icon: <Building2 size={20} />, 
        text: "All Properties", 
        link: "/admin/all-listings",
        roles: ['admin'] 
      },
      { 
        icon: <Users size={20} />, 
        text: "Users", 
        link: "/admin/all-users",
        roles: ['admin'] 
      },
      { 
        icon: <FileText size={20} />, 
        text: "Create Blog", 
        link: role === 'admin' ? "/admin/create-blog" : "/manager/create-blog",
        roles: ['admin', 'manager'] 
      },
      { 
        icon: <PlusSquare size={20} />, 
        text: "Create Listing", 
        link: role === 'admin' ? "/admin/create" : "/manager/create",
        roles: ['admin', 'manager'] 
      },
      { 
        icon: <ClipboardCheck size={20} />, 
        text: "Review Listings", 
        link: "/admin/review-listings",
        roles: ['admin'] 
      },
    ];

    return allMenuItems.filter(item => item.roles.includes(role));
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const menuItems = getMenuItems(currentUser?.role);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 via-blue-800 to-gray-900 
          transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 text-white p-1 rounded-full hidden lg:block"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Profile Section */}
        <div className={`p-6 border-b border-blue-700/30 transition-all duration-300
          ${isCollapsed ? 'items-center' : ''}`}
        >
          <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-4'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 
              flex items-center justify-center text-white shadow-lg">
              {currentUser?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-white">{currentUser?.username}</p>
                <div className="scale-90 origin-left">
                  <RoleBadge role={currentUser?.role} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-150 ease-in-out
                    ${isActive 
                      ? 'bg-blue-600/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="text-blue-200 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 transition-colors whitespace-nowrap">
                        {item.text}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full border-t border-blue-700/30 p-4">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-blue-100 
              hover:bg-white/10 transition-all duration-150 ease-in-out
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
          >
            <LogOut size={20} className="text-blue-200 group-hover:text-white" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Margin */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;