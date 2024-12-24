import React, { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleCreateListing = () => {
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      navigate('/admin/dashboard');
    } else {
      navigate('/create-listing');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      {/* ... other profile content ... */}
      
      <button
        onClick={handleCreateListing}
        className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
      >
        {currentUser.role === 'admin' || currentUser.role === 'manager' 
          ? 'Dashboard'
          : 'Create Listing'
        }
      </button>

      {/* ... rest of the component ... */}
    </div>
  );
}

Profile.propTypes = {
  // Add PropTypes if needed
}; 