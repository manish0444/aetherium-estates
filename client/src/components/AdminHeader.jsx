import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-blue-600">Real</span>
            <span className="text-gray-700">Estate</span>
          </h1>
        </Link>
        
        <Link 
          to="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </header>
  );
} 