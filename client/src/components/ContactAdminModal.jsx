import { X } from 'lucide-react';

export default function ContactAdminModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Contact Admin for Listing
          </h3>
          <p className="text-gray-600 mb-6">
            To list properties for sale or lease, please contact our admin team. They will help you with the verification process and special requirements for these listing types.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Contact Information:</h4>
              <ul className="text-blue-800 space-y-2">
                <li>Email: admin@example.com</li>
                <li>Phone: +1234567890</li>
                <li>Business Hours: 9 AM - 5 PM</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 