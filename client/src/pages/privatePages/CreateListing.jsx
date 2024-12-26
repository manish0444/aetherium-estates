import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Upload,
  Building2,
  Home,
  MapPin,
  DollarSign,
  Check,
  Info,
  X,
} from "lucide-react";
import MapAddressSelector from "../../components/MapAddressSelector";
import HighValueListingModal from "../../components/HighValueListingModal";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C11.4 0 6 5.4 6 12C6 21 18 36 18 36C18 36 30 21 30 12C30 5.4 24.6 0 18 0ZM18 16.2C15.6 16.2 13.8 14.4 13.8 12C13.8 9.6 15.6 7.8 18 7.8C20.4 7.8 22.2 9.6 22.2 12C22.2 14.4 20.4 16.2 18 16.2Z" 
      fill="#4F46E5" 
      filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))"
    />
    <circle cx="18" cy="12" r="4.5" fill="white"/>
  </svg>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const BasicInformationForm = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name <span className="text-red-500">* This field is required</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter property name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type <span className="text-red-500">* This field is required</span>
        </label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="room">Room</option>
          <option value="land" disabled>Land (Contact Admin)</option>
          <option value="office" disabled>Office (Contact Admin)</option>
          <option value="villa" disabled>Villa (Contact Admin)</option>
        </select>
        <p className="mt-2 text-sm text-blue-600">
          Note: For commercial properties, land, or villas, please contact admin.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type <span className="text-red-500">* This field is required</span>
        </label>
        <select
          id="listingType"
          value="rent"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
          disabled
        >
          <option value="rent">For Rent</option>
          <option value="sale" disabled>For Sale (Contact Admin)</option>
          <option value="lease" disabled>For Lease (Contact Admin)</option>
        </select>
        <p className="mt-2 text-sm text-blue-600">
          Note: Only rental listings are available. Contact admin for sales or lease listings.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Status <span className="text-red-500">* This field is required</span>
        </label>
        <select
          id="propertyStatus"
          value={formData.propertyStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ready">Ready to Move</option>
          <option value="underConstruction">Under Construction</option>
          <option value="offPlan">Off-Plan</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">* This field is required</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your property..."
          required
        />
      </div>
    </div>
  );
};

const PropertyDetailsForm = ({ formData, handleChange }) => {
  const showField = (field) => {
    switch (formData.propertyType) {
      case 'room':
        return ['totalArea', 'furnishing'].includes(field);
      case 'apartment':
      case 'house':
        return true; // Show all fields
      default:
        return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {showField('bedrooms') && (
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
      )}

      {showField('bathrooms') && (
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
      )}

      {showField('totalArea') && (
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
      )}

      {showField('builtUpArea') && (
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
      )}

      {showField('floorNumber') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor Number
          </label>
          <input
            type="number"
            id="floorNumber"
            value={formData.floorNumber}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {showField('totalFloors') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floors
          </label>
          <input
            type="number"
            id="totalFloors"
            value={formData.totalFloors}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {showField('furnishing') && (
        <div className="md:col-span-2">
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
            <option value="semiFurnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </div>
      )}
    </div>
  );
};

// Add this function before LocationAmenitiesForm
const getAvailableAmenities = (propertyType) => {
  const commonAmenities = {
    waterSupply: true,
    powerBackup: true,
    internet: true,
    airConditioning: true
  };

  switch (propertyType) {
    case 'room':
      return {
        ...commonAmenities,
        furnished: true
      };
    case 'apartment':
      return {
        ...commonAmenities,
        balcony: true,
        elevator: true,
        security: true,
        parking: true,
        gym: true,
        pool: true
      };
    case 'house':
      return {
        ...commonAmenities,
        garden: true,
        parking: true,
        security: true
      };
    default:
      return commonAmenities;
  }
};

const LocationAmenitiesForm = ({ formData, handleChange }) => {
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]); // Kathmandu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Function to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const address = await getAddressFromCoords(lat, lng);
          handleChange({
            target: { id: 'latitude', value: lat }
          });
          handleChange({
            target: { id: 'longitude', value: lng }
          });
          handleChange({
            target: { id: 'address', value: address }
          });
        } catch (error) {
          console.error('Error handling map click:', error);
        }
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    }, [map]);

    return null;
  };

  // Add this function to handle search-as-you-type
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}, Nepal&limit=3`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add this function to handle location selection
  const handleLocationSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    // Update form data
    handleChange({
      target: { id: 'latitude', value: lat }
    });
    handleChange({
      target: { id: 'longitude', value: lon }
    });
    handleChange({
      target: { id: 'address', value: location.display_name }
    });

    // Update map view
    if (map) {
      map.flyTo([lat, lon], 16);
    }

    setSearchQuery(location.display_name);
    setSearchResults([]);
  };

  // Add this inside the component
  const availableAmenities = getAvailableAmenities(formData.propertyType);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Location <span className="text-red-500">*</span>
        </h3>
        
        {/* Search Bar with Autocomplete */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search location in Nepal..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {result.display_name.split(',')[0]}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {result.display_name.split(',').slice(1).join(',')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keep existing address input */}
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full address"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Map Container */}
        <div className="h-[400px] rounded-lg overflow-hidden">
          <MapContainer
            center={[27.7172, 85.3240]}
            zoom={13}
            className="h-full"
            whenCreated={setMap}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ZoomControl position="bottomright" />
            <MapClickHandler />
            {formData.latitude && formData.longitude && (
              <Marker 
                position={[formData.latitude, formData.longitude]}
                icon={customMarkerIcon}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-medium">{formData.name || 'Selected Location'}</p>
                    <p className="text-sm text-gray-500">{formData.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(formData.amenities)
            .filter(([key]) => availableAmenities[key])
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

const PricingMediaForm = ({ formData, handleChange, handleImageSubmit, files, setFiles, uploading, imageUploadError }) => {
  const currencies = [
    { value: 'NPR', label: 'Nepalese Rupee (Rs)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'custom', label: 'Custom Currency' }
  ];

  return (
    <div className="space-y-8">
      {/* Currency Selection */}
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

      {/* Offer Toggle */}
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

      {/* Pricing Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Price <span className="text-red-500">* This field is required</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.currency === 'custom' ? formData.customCurrency : 
                    formData.currency === 'NPR' ? 'Rs.' :
                    formData.currency === 'USD' ? '$' : '₹'}
                </span>
              </div>
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
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
                  <span className="text-gray-500 sm:text-sm">
                    {formData.currency === 'custom' ? formData.customCurrency : 
                      formData.currency === 'NPR' ? 'Rs.' :
                      formData.currency === 'USD' ? '$' : '₹'}
                  </span>
                </div>
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= formData.regularPrice) {
                      setError("Discount price must be lower than regular price");
                      return;
                    }
                    handleChange(e);
                  }}
                  max={formData.regularPrice - 1}
                  className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Fee (Monthly)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="maintenanceFees"
                value={formData.maintenanceFees}
                onChange={handleChange}
                className="pl-7 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

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

      {/* Media Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Property Images <span className="text-red-500">* At least one image required (Max 6, 200KB each)</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-500 text-sm">{imageUploadError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
};

const ReviewSubmitForm = ({ formData }) => {
  const getCurrencySymbol = () => {
    if (formData.currency === 'custom') return formData.customCurrency;
    if (formData.currency === 'NPR') return 'Rs.';
    if (formData.currency === 'USD') return '$';
    return '₹';
  };

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Property Name", value: formData.name },
        { label: "Property Type", value: formData.propertyType },
        { label: "Listing Type", value: formData.listingType },
        { label: "Property Status", value: formData.propertyStatus },
      ]
    },
    {
      title: "Property Details",
      fields: [
        ...(formData.propertyType !== 'room' ? [
          { label: "Bedrooms", value: formData.bedrooms },
          { label: "Bathrooms", value: formData.bathrooms },
        ] : []),
        { label: "Total Area", value: `${formData.totalArea} sq ft` },
        ...(formData.propertyType !== 'room' ? [
          { label: "Built-up Area", value: `${formData.builtUpArea} sq ft` },
          { label: "Floor Number", value: formData.floorNumber },
          { label: "Furnishing", value: formData.furnishing },
        ] : [])
      ].filter(field => field.value && field.value !== '0 sq ft')
    },
    {
      title: "Pricing",
      fields: [
        { 
          label: "Regular Price", 
          value: `${getCurrencySymbol()}${formData.regularPrice.toLocaleString()}`
        },
        ...(formData.offer ? [{
          label: "Discounted Price",
          value: `${getCurrencySymbol()}${formData.discountPrice.toLocaleString()}`
        }] : []),
        ...(formData.maintenanceFees ? [{
          label: "Maintenance Fee",
          value: `${getCurrencySymbol()}${formData.maintenanceFees.toLocaleString()}`
        }] : []),
        ...(formData.deposit ? [{
          label: "Security Deposit",
          value: `${getCurrencySymbol()}${formData.deposit.toLocaleString()}`
        }] : []),
        { label: "Payment Frequency", value: formData.paymentFrequency },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1">
                <p className="text-sm text-gray-500">{field.label}</p>
                <p className="text-base font-medium text-gray-900">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Preview Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
          Property Images
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Property ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const UserRestrictionNotice = ({ listingsCount, remainingListings, hasReachedLimit }) => {
  return (
    <div className={`${
      hasReachedLimit ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
    } border rounded-xl p-6 mb-6 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Info className={`w-5 h-5 ${hasReachedLimit ? 'text-red-500' : 'text-blue-500'}`} />
          <h3 className={`font-semibold ${hasReachedLimit ? 'text-red-700' : 'text-blue-700'}`}>
            {hasReachedLimit ? 'Listing Limit Reached' : 'Free User Restrictions'}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Listings Created</span>
              <span className="font-semibold">{listingsCount} of {MAX_USER_LISTINGS}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  hasReachedLimit ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(listingsCount / MAX_USER_LISTINGS) * 100}%` }}
              />
            </div>
          </div>

          {hasReachedLimit ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">
                You've reached the maximum limit of {MAX_USER_LISTINGS} listings (including deleted ones).
              </p>
              <button
                onClick={() => {/* Add upgrade handler */}}
                className="relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold 
                           hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200
                           animate-shimmer overflow-hidden"
              >
                <span className="relative z-10">Upgrade to Pro</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </button>
            </div>
          ) : (
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {remainingListings} listings remaining (deleted listings count towards limit)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Maximum price limit: NPR {MAX_USER_PRICE.toLocaleString()}
              </li>
            </ul>
          )}
        </div>
      </div>
      
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-current to-transparent opacity-10 rounded-full" />
    </div>
  );
};

const MAX_USER_LISTINGS = 3;
const MAX_USER_PRICE = 15000;

// Add this component for mobile steps
const MobileSteps = ({ steps, activeStep }) => {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between px-4">
        <span className="text-sm text-gray-500">Step {activeStep} of {steps.length}</span>
        <span className="font-medium">{steps[activeStep - 1].title}</span>
      </div>
      <div className="mt-2 px-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Add this component for desktop progress steps
const DesktopProgressSteps = ({ steps, activeStep }) => {
  return (
    <div className="hidden lg:block mb-8 px-4">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 transform -translate-y-1/2 h-1 w-full bg-gray-200 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {activeStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm">{step.number}</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                activeStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHighValueModal, setShowHighValueModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [userListingsCount, setUserListingsCount] = useState(0);
  const [remainingListings, setRemainingListings] = useState(MAX_USER_LISTINGS);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const [formData, setFormData] = useState({
    // Required fields
    name: "",
    description: "",
    propertyType: "apartment",
    listingType: "rent",
    address: "",
    regularPrice: 0,
    imageUrls: [],
    
    // Optional fields with default values
    propertyStatus: "ready",
    bedrooms: 0,
    bathrooms: 0,
    totalArea: "",
    builtUpArea: "",
    parkingSpaces: 0,
    floorNumber: "",
    totalFloors: "",
    yearBuilt: "",
    furnishing: "unfurnished",
    latitude: 0,
    longitude: 0,
    nearbyLandmarks: [],
    
    amenities: {
      balcony: false,
      pool: false,
      gym: false,
      garden: false,
      security: false,
      elevator: false,
      waterSupply: false,
      powerBackup: false,
      internet: false,
      airConditioning: false
    },
    
    features: {
      petsAllowed: false,
      smokingAllowed: false,
      featured: false
    },
    
    discountPrice: 0,
    maintenanceFees: 0,
    deposit: 0,
    paymentFrequency: "monthly",
    pricePerSqFt: 0,
    
    tags: [],
    highlights: [],
    status: "draft",
    type: 'rent',           // Required field
    offer: false,           // Required field
    parking: false,         // Required field
    furnished: false,       // Required field
    currency: 'NPR',        // Default currency
    customCurrency: '',     // For custom currency
  });

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

  useEffect(() => {
    const fetchUserListingsCount = async () => {
      if (!currentUser?._id) return;
      
      try {
        // Use the correct endpoint path
        const res = await fetch(`/api/user/listings/count/${currentUser._id}`);
        const data = await res.json();
        
        if (res.ok) {
          setUserListingsCount(data.totalCount || 0);
          setRemainingListings(data.remainingListings || 0);
          setHasReachedLimit(data.hasReachedLimit || false);
        }
      } catch (error) {
        console.error('Error fetching listings count:', error);
      }
    };

    fetchUserListingsCount();
  }, [currentUser?._id]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'regularPrice' && currentUser.role !== 'agent') {
      const numValue = Number(value);
      const convertedPrice = convertToNPR(numValue, formData.currency);
      
      if (convertedPrice > MAX_USER_PRICE) {
        setError(`Regular users cannot set price higher than NPR ${MAX_USER_PRICE}. Please upgrade to agent.`);
        return;
      }
    }

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
      } else if (id.startsWith("features.")) {
        const featureName = id.split(".")[1];
        setFormData(prev => ({
          ...prev,
          features: {
            ...prev.features,
            [featureName]: checked
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
      setError(null);

      // Check if user has reached limit
      if (currentUser.role !== 'agent' && hasReachedLimit) {
        setError('You have reached the maximum limit of listings. Please upgrade to agent to create more.');
        return;
      }

      // If it's not the final step, just move to next step
      if (activeStep < steps.length) {
        if (!validateStep()) {
          setError("Please fill in all required fields for this step");
          return;
        }
        handleStepChange('next');
        return;
      }

      // Final submission
      await submitListing();

    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const submitListing = async () => {
    try {
      // Simplify the listing data
      const listingData = {
        ...formData,
        userRef: currentUser._id,
        status: 'active', // Use 'active' instead of 'published'
        type: 'rent',
        regularPrice: Number(formData.regularPrice),
        discountPrice: formData.offer ? Number(formData.discountPrice) : 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        totalArea: Number(formData.totalArea) || 0,
        builtUpArea: Number(formData.builtUpArea) || 0,
        floorNumber: Number(formData.floorNumber) || 0,
        totalFloors: Number(formData.totalFloors) || 0,
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0,
        maintenanceFees: Number(formData.maintenanceFees) || 0,
        deposit: Number(formData.deposit) || 0
      };

      // Check user permissions for regular users
      if (currentUser.role !== 'admin' && currentUser.role !== 'agent') {
        // Check listing count
        if (userListingsCount >= MAX_USER_LISTINGS) {
          throw new Error(`Free users can only create up to ${MAX_USER_LISTINGS} listings. Please upgrade to agent to create more.`);
        }

        // Check price limit
        const priceInNPR = convertToNPR(listingData.regularPrice, listingData.currency);
        if (priceInNPR > MAX_USER_PRICE) {
          throw new Error(`Regular users cannot set price higher than NPR ${MAX_USER_PRICE}. Please upgrade to agent.`);
        }
      }

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      const data = await res.json();
      
      if (data.success === false) {
        throw new Error(data.message);
      }

      setNotification({
        show: true,
        type: 'success',
        message: 'Listing created successfully'
      });

      // Navigate after successful creation
      setTimeout(() => {
        navigate(`/listing/${data._id}`);
      }, 2000);

    } catch (error) {
      setError(error.message || "Failed to create listing");
      setLoading(false);
    }
  };

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
        // For room type, only validate total area
        if (formData.propertyType === 'room') {
          if (!formData.totalArea) {
            setError("Please enter the total area");
            return false;
          }
        }
        return true;

      case 3:
        if (!formData.address || !formData.latitude || !formData.longitude) {
          setError("Please select a location on the map");
          return false;
        }
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
    if (direction === 'next' && !validateStep()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setError(null);
    setActiveStep(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(null);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check file size (200KB = 200 * 1024 bytes)
        if (file.size > 200 * 1024) {
          setImageUploadError("Each image must be less than 200KB");
          setUploading(false);
          return;
        }
        promises.push(fileToBase64(file));
      }

      try {
        const base64Images = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...base64Images]
        });
        setFiles([]);
      } catch (error) {
        setImageUploadError("Image upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
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

  // Add function to remove uploaded image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  // Add currency conversion function
  const convertToNPR = (amount, currency) => {
    const rates = {
      'NPR': 1,
      'USD': 132.5, // Example rate
      'EUR': 143.8, // Example rate
      'INR': 1.6,   // Example rate
    };
    return amount * rates[currency];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        {currentUser.role !== 'agent' && (
          <UserRestrictionNotice 
            listingsCount={userListingsCount}
            remainingListings={remainingListings}
            hasReachedLimit={hasReachedLimit}
          />
        )}
        
        {/* Disable form if limit reached */}
        <div className={`${hasReachedLimit ? 'opacity-50 pointer-events-none filter blur-[1px]' : ''}`}>
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
                  files={files}
                  setFiles={setFiles}
                  uploading={uploading}
                  imageUploadError={imageUploadError}
                />
              )}
              {activeStep === 5 && (
                <ReviewSubmitForm formData={formData} />
              )}
                </div>

              {/* Navigation Buttons - Make sticky on mobile */}
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
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-lg text-white text-sm font-medium ${
                    activeStep === steps.length
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : activeStep === steps.length ? (
                    'Submit Listing'
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      {/* High Value Modal */}
      <HighValueListingModal
        isOpen={showHighValueModal}
        onClose={() => setShowHighValueModal(false)}
        price={formData.offer ? formData.discountPrice : formData.regularPrice}
        commission={Math.round((formData.offer ? formData.discountPrice : formData.regularPrice) * 0.03)}
        onSubmit={() => {
          setShowHighValueModal(false);
          submitListing(true);
        }}
      />
    </div>
  );
}
