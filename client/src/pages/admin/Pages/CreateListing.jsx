import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Upload,
  Building2,
  Home,
  MapPin,
  DollarSign,
  Check,
  X,
} from "lucide-react";
import Sidebar from '../Navbar/page';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';

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

// Form Components
const BasicInformationForm = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Property Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter property name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="room">Room</option>
          <option value="land">Land</option>
          <option value="office">Office</option>
          <option value="villa">Villa</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Listing Type <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        >
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
          <option value="lease">For Lease</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter property description"
          rows="4"
          required
        />
      </div>
    </div>
  );
};

BasicInformationForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    propertyType: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

const PropertyDetailsForm = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Bedrooms
        </label>
        <input
          type="number"
          id="bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Bathrooms
        </label>
        <input
          type="number"
          id="bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Total Area (sq ft)
        </label>
        <input
          type="number"
          id="totalArea"
          value={formData.totalArea}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Built-up Area (sq ft)
        </label>
        <input
          type="number"
          id="builtUpArea"
          value={formData.builtUpArea}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Floor Number
        </label>
        <input
          type="number"
          id="floorNumber"
          value={formData.floorNumber}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Total Floors
        </label>
        <input
          type="number"
          id="totalFloors"
          value={formData.totalFloors}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Furnishing Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="furnished"
              checked={formData.furnished}
              onChange={(e) => handleChange({
                target: {
                  id: 'furnished',
                  value: e.target.checked
                }
              })}
              className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-200">Furnished</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Parking
        </label>
        <select
          id="parking"
          value={formData.parking}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        >
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>
      </div>
    </div>
  );
};

PropertyDetailsForm.propTypes = {
  formData: PropTypes.shape({
    bedrooms: PropTypes.string,
    bathrooms: PropTypes.string,
    totalArea: PropTypes.string,
    builtUpArea: PropTypes.string,
    floorNumber: PropTypes.string,
    totalFloors: PropTypes.string,
    furnished: PropTypes.string,
    parking: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

const LocationAmenitiesForm = ({ formData, handleChange, setFormData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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

  const MapClickHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const address = data.display_name;

          setFormData(prev => ({
            ...prev,
            latitude: Number(lat),
            longitude: Number(lng),
            address: address
          }));

          map.setView([lat, lng], map.getZoom());
        } catch (error) {
          console.error('Error handling map click:', error);
        }
      };

      map.on('click', handleMapClick);
      return () => map.off('click', handleMapClick);
    }, [map, setFormData]);

    return null;
  };

  const handleLocationSelect = (location) => {
    const lat = Number(location.lat);
    const lon = Number(location.lon);

    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      address: location.display_name
    }));

    if (map) {
      map.setView([lat, lon], 16);
    }

    setSearchQuery(location.display_name);
    setSearchResults([]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">
          Location <span className="text-red-500">*</span>
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search location in Nepal..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-700">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-150 border-b border-gray-700 last:border-0"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-200">
                          {result.display_name.split(',')[0]}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {result.display_name.split(',').slice(1).join(',')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full address"
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

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

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(formData.amenities).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-800">
              <input
                type="checkbox"
                id={`amenities.${key}`}
                checked={value}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <span className="text-sm text-gray-200 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

LocationAmenitiesForm.propTypes = {
  formData: PropTypes.shape({
    address: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

const PricingMediaForm = ({ formData, handleChange, handleImageSubmit, handleVideoSubmit, handleRemoveVideo, handleRemoveImage, files, setFiles, videoFile, setVideoFile, uploading, videoUploading, imageUploadError, videoUploadError }) => {
  const currencies = [
    { value: 'NPR', label: 'Nepalese Rupee (Rs)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'custom', label: 'Custom Currency' }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Currency Settings</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <select
              id="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <span className="text-gray-200">Enable Special Offer/Discount</span>
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-200">Pricing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Regular Price <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">
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
                className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {formData.offer && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Discounted Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">
                    {formData.currency === 'custom' ? formData.customCurrency : 
                      formData.currency === 'NPR' ? 'Rs.' :
                      formData.currency === 'USD' ? '$' : '₹'}
                  </span>
                </div>
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Maintenance Fee (Monthly)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">
                  {formData.currency === 'custom' ? formData.customCurrency : 
                    formData.currency === 'NPR' ? 'Rs.' :
                    formData.currency === 'USD' ? '$' : '₹'}
                </span>
              </div>
              <input
                type="number"
                id="maintenanceFees"
                value={formData.maintenanceFees}
                onChange={handleChange}
                className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Security Deposit
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">
                  {formData.currency === 'custom' ? formData.customCurrency : 
                    formData.currency === 'NPR' ? 'Rs.' :
                    formData.currency === 'USD' ? '$' : '₹'}
                </span>
              </div>
              <input
                type="number"
                id="deposit"
                value={formData.deposit}
                onChange={handleChange}
                className="pl-12 w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Payment Frequency
            </label>
            <select
              id="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-200">
          Property Images <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200"
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

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-200">
          Property Video
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200"
          />
          <button
            type="button"
            onClick={handleVideoSubmit}
            disabled={!videoFile || videoUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {videoUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {videoUploadError && (
          <p className="text-red-500 text-sm">{videoUploadError}</p>
        )}
      </div>
    </div>
  );
};

PricingMediaForm.propTypes = {
  formData: PropTypes.shape({
    type: PropTypes.string,
    description: PropTypes.string,
    bedrooms: PropTypes.string,
    bathrooms: PropTypes.string,
    totalArea: PropTypes.string,
    builtUpArea: PropTypes.string,
    floorNumber: PropTypes.string,
    totalFloors: PropTypes.string,
    furnished: PropTypes.string,
    parking: PropTypes.string,
    address: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    currency: PropTypes.string,
    customCurrency: PropTypes.string,
    offer: PropTypes.bool,
    regularPrice: PropTypes.string,
    discountPrice: PropTypes.string,
    maintenanceFees: PropTypes.string,
    deposit: PropTypes.string,
    paymentFrequency: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleImageSubmit: PropTypes.func.isRequired,
  handleVideoSubmit: PropTypes.func.isRequired,
  handleRemoveVideo: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired,
  videoFile: PropTypes.object,
  setVideoFile: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  videoUploading: PropTypes.bool.isRequired,
  imageUploadError: PropTypes.string,
  videoUploadError: PropTypes.string,
};

const ReviewSubmitForm = ({ formData }) => {
  const getCurrencySymbol = () => {
    if (formData.currency === 'custom') return formData.customCurrency;
    if (formData.currency === 'NPR') return 'Rs.';
    if (formData.currency === 'USD') return '$';
    return '₹';
  };

  const getListingTypeDisplay = (type) => {
    switch (type) {
      case 'rent':
        return 'For Rent';
      case 'sale':
        return 'For Sale';
      case 'lease':
        return 'For Lease';
      default:
        return type;
    }
  };

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Property Name", value: formData.name },
        { label: "Property Type", value: formData.propertyType },
        { label: "Listing Type", value: getListingTypeDisplay(formData.type) },
        { label: "Property Status", value: formData.propertyStatus },
        { label: "Description", value: formData.description },
        { label: "Address", value: formData.address }
      ]
    },
    {
      title: "Property Details",
      fields: [
        { label: "Bedrooms", value: formData.bedrooms },
        { label: "Bathrooms", value: formData.bathrooms },
        { label: "Total Area", value: `${formData.totalArea} sq ft` },
        { label: "Built-up Area", value: `${formData.builtUpArea} sq ft` },
        { label: "Floor Number", value: formData.floorNumber },
        { label: "Total Floors", value: formData.totalFloors },
        { label: "Furnishing", value: formData.furnishing },
        { label: "Parking", value: formData.parking ? "Available" : "Not Available" }
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
        { label: "Payment Frequency", value: formData.paymentFrequency }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1">
                <p className="text-sm text-gray-400">{field.label}</p>
                <p className="text-base font-medium text-gray-200">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
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

ReviewSubmitForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    propertyType: PropTypes.string,
    type: PropTypes.string,
    propertyStatus: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string,
    bedrooms: PropTypes.string,
    bathrooms: PropTypes.string,
    totalArea: PropTypes.string,
    builtUpArea: PropTypes.string,
    floorNumber: PropTypes.string,
    totalFloors: PropTypes.string,
    furnishing: PropTypes.string,
    parking: PropTypes.string,
    regularPrice: PropTypes.string,
    offer: PropTypes.bool,
    discountPrice: PropTypes.string,
    maintenanceFees: PropTypes.string,
    deposit: PropTypes.string,
    paymentFrequency: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    currency: PropTypes.string,
    customCurrency: PropTypes.string,
  }).isRequired,
};

// Update the main component's return statement to include all form steps
export default function AdminCreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Property Details" },
    { number: 3, title: "Location & Amenities" },
    { number: 4, title: "Pricing & Media" },
    { number: 5, title: "Review & Submit" }
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    propertyType: "apartment",
    type: "rent",
    address: "",
    regularPrice: 0,
    imageUrls: [],
    propertyStatus: "ready",
    bedrooms: 0,
    bathrooms: 0,
    totalArea: "",
    builtUpArea: "",
    parkingSpaces: 0,
    floorNumber: "",
    totalFloors: "",
    furnishing: "unfurnished",
    latitude: null,
    longitude: null,
    furnished: false,
    parking: false,
    offer: false,
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
    currency: 'NPR',
    customCurrency: '',
    discountPrice: 0,
    maintenanceFees: 0,
    deposit: 0,
    paymentFrequency: "monthly",
    videoUrl: '',
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      if (id.startsWith('amenities.')) {
        // Handle amenities checkboxes
        const amenityName = id.split('.')[1];
        setFormData({
          ...formData,
          amenities: {
            ...formData.amenities,
            [amenityName]: checked
          }
        });
      } else {
        // Handle other checkboxes
        setFormData({
          ...formData,
          [id]: checked
        });
      }
    } else if (type === 'number') {
      // Handle number inputs
      setFormData({
        ...formData,
        [id]: value === '' ? '' : Number(value)
      });
    } else {
      // Handle all other inputs
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // If it's not the final step, just move to next step
      if (activeStep < steps.length) {
        if (validateStep()) {
          setActiveStep(prev => prev + 1);
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
        deposit: Number(formData.deposit) || 0,
        status: currentUser.role === 'manager' ? 'draft' : 'active',
        videoUrl: formData.videoUrl || ''
      };

      const res = await fetch("/api/listing/create", {
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

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(null);

      // Calculate total size of existing and new images
      const existingSize = formData.imageUrls.reduce((sum, url) => {
        // Rough estimation of base64 string size
        return sum + (url.length * 0.75);
      }, 0);

      const newFilesSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
      const totalSize = existingSize + newFilesSize;
      const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB in bytes

      if (totalSize > MAX_TOTAL_SIZE) {
        setImageUploadError("Total image size must be less than 5MB. Please compress your images or select fewer images.");
        setUploading(false);
        return;
      }

      try {
        // Convert files to smaller base64 strings
        const processImage = async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                const maxDimension = 800;
                if (width > height && width > maxDimension) {
                  height = (height * maxDimension) / width;
                  width = maxDimension;
                } else if (height > maxDimension) {
                  width = (width * maxDimension) / height;
                  height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with reduced quality
                resolve(canvas.toDataURL('image/jpeg', 0.6));
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          });
        };

        const processedImages = await Promise.all(
          Array.from(files).map(file => processImage(file))
        );

        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...processedImages]
        }));
        
        setFiles([]);
        setImageUploadError(null);
      } catch (error) {
        console.error('Image processing error:', error);
        setImageUploadError("Failed to process images. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getSubmitButtonText = () => {
    if (loading) return 'Processing...';
    if (currentUser.role === 'manager') return 'Submit for Review';
    return 'Create Listing';
  };

  const handleVideoSubmit = async () => {
    if (!videoFile) return;

    // Check file size (max 50MB)
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (videoFile.size > MAX_VIDEO_SIZE) {
      setVideoUploadError("Video must be less than 50MB");
      return;
    }

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';

    try {
      setVideoUploading(true);
      setVideoUploadError(null);

      // Create a promise to handle video metadata loading
      const checkDuration = new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve(video.duration);
        video.onerror = () => reject('Error loading video');
        video.src = URL.createObjectURL(videoFile);
      });

      const duration = await checkDuration;
      URL.revokeObjectURL(video.src);

      if (duration > 60) {
        setVideoUploadError("Video must be less than 1 minute long");
        setVideoUploading(false);
        return;
      }

      // Convert video to base64
      const base64Video = await fileToBase64(videoFile);
      
      // Update form data with video URL
      setFormData(prevData => ({
        ...prevData,
        videoUrl: base64Video
      }));
      
      setVideoFile(null);
      setVideoUploadError(null);
    } catch (err) {
      console.error('Video upload error:', err);
      setVideoUploadError("Failed to process video. Please try again.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleRemoveVideo = () => {
    setFormData({
      ...formData,
      videoUrl: ''
    });
  };

  const validateStep = (step, formData) => {
    switch (step) {
      case 1:
        return formData.name && formData.propertyType && formData.type && formData.description;
      case 2:
        return formData.bedrooms && formData.bathrooms && formData.totalArea;
      case 3:
        return formData.address && formData.latitude && formData.longitude;
      case 4:
        return formData.regularPrice && (!formData.offer || (formData.offer && formData.discountPrice));
      default:
        return true;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-8 px-4">
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 h-1 w-full bg-gray-700 rounded-full" />
              
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        activeStep >= step.number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 border-2 border-gray-600 text-gray-400'
                      }`}
                    >
                      {activeStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm">{step.number}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                      activeStep >= step.number ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-8">
              {activeStep === 1 && (
              <BasicInformationForm formData={formData} handleChange={handleChange} />
              )}
              {activeStep === 2 && (
                <PropertyDetailsForm formData={formData} handleChange={handleChange} />
              )}
              {activeStep === 3 && (
                <LocationAmenitiesForm 
                  formData={formData} 
                  handleChange={handleChange}
                  setFormData={setFormData}
                />
              )}
              {activeStep === 4 && (
                <PricingMediaForm
                  formData={formData}
                  handleChange={handleChange}
                  handleImageSubmit={handleImageSubmit}
                  handleVideoSubmit={handleVideoSubmit}
                  handleRemoveVideo={handleRemoveVideo}
                  handleRemoveImage={handleRemoveImage}
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
              
              {error && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeStep === 1}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>

                {activeStep === steps.length ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {getSubmitButtonText()}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}