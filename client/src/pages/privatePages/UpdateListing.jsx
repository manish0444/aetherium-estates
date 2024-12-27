import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { X, MoreVertical } from "lucide-react";

const BasicInformationForm = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter property name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your property"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-32"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="room">Room</option>
          <option value="land">Land</option>
          <option value="office">Office</option>
          <option value="villa">Villa</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Status
        </label>
        <select
          id="propertyStatus"
          value={formData.propertyStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        >
          <option value="ready">Ready to Move</option>
          <option value="underConstruction">Under Construction</option>
          <option value="offPlan">Off Plan</option>
        </select>
      </div>
    </div>
  );
};

const PropertyDetailsForm = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Area (sq ft)
          </label>
          <input
            type="number"
            id="totalArea"
            value={formData.totalArea}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Built-up Area (sq ft)
          </label>
          <input
            type="number"
            id="builtUpArea"
            value={formData.builtUpArea}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing Status
        </label>
        <select
          id="furnishing"
          value={formData.furnishing}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        >
          <option value="unfurnished">Unfurnished</option>
          <option value="semiFurnished">Semi Furnished</option>
          <option value="furnished">Fully Furnished</option>
        </select>
      </div>
    </div>
  );
};

const LocationAmenitiesForm = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter property address"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
          required
          disabled
        />
        <p className="mt-2 text-sm text-gray-500">
          Location cannot be changed after listing creation
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(formData.amenities)
            .map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`amenities.${key}`}
                  checked={value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
        </div>
      </div>
    </div>
  );
};

const PricingMediaForm = ({
  formData,
  handleChange,
  handleImageSubmit,
  handleVideoSubmit,
  handleRemoveVideo,
  files,
  setFiles,
  videoFile,
  setVideoFile,
  uploading,
  videoUploading,
  imageUploadError,
  videoUploadError,
}) => {
  const currencies = [
    { value: 'NPR', label: 'Nepalese Rupee (Rs)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'custom', label: 'Custom Currency' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Currency Settings</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <select
              id="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>
          {formData.currency === 'custom' && (
            <div className="flex-1">
              <input
                type="text"
                id="customCurrency"
                value={formData.customCurrency}
                onChange={handleChange}
                placeholder="Enter currency symbol"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="offer"
            checked={formData.offer}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">Enable Special Offer/Discount</span>
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                className="pl-7 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.offer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discounted Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="pl-7 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Deposit
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="deposit"
                value={formData.deposit}
                onChange={handleChange}
                className="pl-7 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Frequency
            </label>
            <select
              id="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Property Video</h3>
          <span className="text-sm text-gray-500">Max 1 minute</span>
        </div>
        
        <div className="flex gap-4">
          <input
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="p-3 border border-gray-300 rounded w-full"
            type="file"
            accept="video/*"
            disabled={formData.videoUrl || videoUploading}
          />
          <button
            type="button"
            disabled={!videoFile || videoUploading}
            onClick={handleVideoSubmit}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {videoUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        
        {videoUploadError && (
          <p className="text-red-700 text-sm">{videoUploadError}</p>
        )}

        {formData.videoUrl && (
          <div className="flex justify-between p-3 border items-center">
            <video
              src={formData.videoUrl}
              className="w-48 h-auto"
              controls
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Property Images</h3>
          <span className="text-sm text-gray-500">Max 5 images</span>
        </div>
        
        <div className="flex gap-4">
          <input
            onChange={(e) => setFiles(e.target.files)}
            className="p-3 border border-gray-300 rounded w-full"
            type="file"
            accept="image/*"
            multiple
            disabled={formData.imageUrls.length >= 5 || uploading}
          />
          <button
            type="button"
            disabled={!files.length || uploading}
            onClick={handleImageSubmit}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {imageUploadError && (
          <p className="text-red-700 text-sm">{imageUploadError}</p>
        )}

        {formData.imageUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewSubmitForm = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Listing</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Property Name</h4>
            <p className="mt-1">{formData.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1">{formData.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Property Type</h4>
              <p className="mt-1 capitalize">{formData.propertyType}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Property Status</h4>
              <p className="mt-1 capitalize">{formData.propertyStatus.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1">{formData.address}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Price</h4>
              <p className="mt-1">
                {formData.currency === 'custom' ? formData.customCurrency :
                 formData.currency === 'NPR' ? 'Rs.' :
                 formData.currency === 'USD' ? '$' : '₹'}
                {formData.regularPrice.toLocaleString()}
                {formData.offer && ` (${formData.discountPrice.toLocaleString()} discount)`}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Amenities</h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {Object.entries(formData.amenities)
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopProgressSteps = ({ steps, activeStep }) => {
  return (
    <div className="hidden lg:block mb-8">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                step.number <= activeStep ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors duration-300 ${
                  step.number <= activeStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {step.number}
              </div>
              <div className="text-sm font-medium">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileSteps = ({ steps, activeStep }) => {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        <div className="ml-4 min-w-fit">
          <span className="text-sm font-medium text-gray-900">
            Step {activeStep} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    videoUrl: '',
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    propertyType: "apartment",
    propertyStatus: "ready",
    furnishing: "unfurnished",
    currency: "NPR",
    customCurrency: "",
    maintenanceFees: 0,
    deposit: 0,
    paymentFrequency: "monthly",
    amenities: {},
    latitude: null,
    longitude: null
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Property Types Options
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "land", label: "Land" },
    { value: "office", label: "Office" },
    { value: "villa", label: "Villa" }
  ];

  // Form Steps
  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Property Details" },
    { number: 3, title: "Location & Amenities" },
    { number: 4, title: "Pricing & Media" },
    { number: 5, title: "Review & Submit" }
  ];

  // Function to validate current step
  const validateStep = () => {
    switch (activeStep) {
      case 1:
        if (!formData.name || !formData.description || !formData.propertyType) {
          setError("Please fill in all required fields in Basic Information");
          return false;
        }
        return true;

      case 2:
        if (formData.propertyType === 'room') {
          if (!formData.totalArea) {
            setError("Please enter the total area");
            return false;
          }
        }
        return true;

      case 3:
        // Skip location validation since it's disabled
        return true;

      case 4:
        if (!formData.regularPrice) {
          setError("Please enter the regular price");
          return false;
        }
        if (formData.offer && (!formData.discountPrice || formData.discountPrice >= formData.regularPrice)) {
          setError("Discount price must be lower than regular price");
          return false;
        }
        if (formData.imageUrls.length === 0) {
          setError("Please upload at least one image");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Function to handle step navigation
  const handleStepChange = (direction) => {
    if (direction === 'next') {
      if (!validateStep()) {
        return;
      }
      setActiveStep(prev => prev + 1);
    } else {
      setActiveStep(prev => prev - 1);
    }
    setError(null);
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      if (!listingId) {
        setError("No listing ID provided");
        return;
      }

      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          return;
        }

        // Ensure all required fields are present
        setFormData({
          ...data,
          propertyType: data.propertyType || 'apartment',
          currency: data.currency || 'NPR',
          maintenanceFees: data.maintenanceFees || 0,
          deposit: data.deposit || 0,
          paymentFrequency: data.paymentFrequency || 'monthly',
          amenities: data.amenities || {},
          furnishing: data.furnishing || 'unfurnished',
          propertyStatus: data.propertyStatus || 'ready',
          imageUrls: data.imageUrls || [],
          videoUrl: data.videoUrl || ''
        });
      } catch (error) {
        setError("Failed to fetch listing");
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleVideoSubmit = async () => {
    if (!videoFile) return;

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = async function() {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;

      if (duration > 60) {
        setVideoUploadError("Video must be less than 1 minute long");
        return;
      }

      // Proceed with upload if duration is valid
      setVideoUploading(true);
      setVideoUploadError(null);

      try {
        const base64Video = await fileToBase64(videoFile);
        setFormData({
          ...formData,
          videoUrl: base64Video
        });
        setVideoFile(null);
      } catch (error) {
        setVideoUploadError("Video upload failed");
      } finally {
        setVideoUploading(false);
      }
    };

    video.src = URL.createObjectURL(videoFile);
  };

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 5) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Each image must be less than 2MB");
          setUploading(false);
          return;
        }
        promises.push(fileToBase64(file));
      }

      Promise.all(promises)
        .then((base64Images) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(base64Images),
          });
          setImageUploadError(false);
          setUploading(false);
          setFiles([]);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload up to 5 images per listing");
      setUploading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveVideo = () => {
    setFormData({
      ...formData,
      videoUrl: ''
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (id.startsWith("amenities.")) {
        const amenityName = id.split(".")[1];
        setFormData(prev => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            [amenityName]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [id]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      // If it's not the final step, just move to next step
      if (activeStep < steps.length) {
        if (validateStep()) {
          handleStepChange('next');
        }
        setLoading(false);
        return;
      }

      // Final submission
      if (!validateStep()) {
        setLoading(false);
        return;
      }

      const listingData = {
        ...formData,
        userRef: currentUser._id,
        regularPrice: Number(formData.regularPrice),
        discountPrice: formData.offer ? Number(formData.discountPrice) : 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        totalArea: Number(formData.totalArea) || 0,
        builtUpArea: Number(formData.builtUpArea) || 0,
        floorNumber: Number(formData.floorNumber) || 0,
        totalFloors: Number(formData.totalFloors) || 0,
        maintenanceFees: Number(formData.maintenanceFees) || 0,
        deposit: Number(formData.deposit) || 0
      };

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Progress Steps - Hide on mobile */}
        <DesktopProgressSteps steps={steps} activeStep={activeStep} />

        {/* Mobile Progress Steps */}
        <MobileSteps steps={steps} activeStep={activeStep} />

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Mobile Step Title */}
            <div className="p-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">
                {steps[activeStep - 1].title}
              </h2>
            </div>

            {/* Form Fields */}
            <div className="p-4 sm:p-6 space-y-6">
              {activeStep === 1 && (
                <BasicInformationForm formData={formData} handleChange={handleChange} />
              )}
              {activeStep === 2 && (
                <PropertyDetailsForm formData={formData} handleChange={handleChange} />
              )}
              {activeStep === 3 && (
                <LocationAmenitiesForm formData={formData} handleChange={handleChange} />
              )}
              {activeStep === 4 && (
                <PricingMediaForm
                  formData={formData}
                  handleChange={handleChange}
                  handleImageSubmit={handleImageSubmit}
                  handleVideoSubmit={handleVideoSubmit}
                  handleRemoveVideo={handleRemoveVideo}
                  files={files}
                  setFiles={setFiles}
                  videoFile={videoFile}
                  setVideoFile={setVideoFile}
                  uploading={uploading}
                  videoUploading={videoUploading}
                  imageUploadError={imageUploadError}
                  videoUploadError={videoUploadError}
                />
              )}
              {activeStep === 5 && (
                <ReviewSubmitForm formData={formData} />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              {activeStep > 1 && (
            <button
              type="button"
                  onClick={() => handleStepChange('prev')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
                  Back
            </button>
              )}
              {activeStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => handleStepChange('next')}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Next
                </button>
              ) : (
          <button
                  type="submit"
            disabled={loading || uploading || videoUploading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-70"
          >
                  {loading ? "Updating..." : "Update Listing"}
          </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
