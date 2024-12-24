import React from 'react';

export default function HighValueListingModal({ isOpen, onClose, price, commission, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Admin Approval Required
          </h3>
          
          <div className="space-y-3 text-gray-600">
            <p>
              Your listing price of Rs. {price.toLocaleString()} requires admin approval 
              as it exceeds Rs. 15,000.
            </p>
            <p>
              A commission fee of Rs. {commission.toLocaleString()} (3%) will be applicable 
              upon approval.
            </p>
            <p>
              Your listing will be submitted for admin review. You will be notified once 
              it's approved.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}