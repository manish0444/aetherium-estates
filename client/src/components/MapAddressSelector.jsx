import React, { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";

const MapAddressSelector = ({ onAddressSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && window.L) {
      // Initialize map
      const mapInstance = L.map("map").setView([28.3949, 84.124], 7); // India center

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      // Create custom icon
      const customIcon = L.icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#3B82F6"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Add click event handler to the map
      mapInstance.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        // Update marker with animation
        if (marker) {
          marker.remove();
        }
        const newMarker = L.marker([lat, lng], {
          icon: customIcon,
          animate: true,
        }).addTo(mapInstance);

        // Add bounce animation
        newMarker.bounce = function () {
          const originalLatLng = this.getLatLng();
          let bounceHeight = 0;
          let direction = 1;
          const animation = setInterval(() => {
            bounceHeight += 0.3 * direction;
            if (bounceHeight > 2) direction = -1;
            if (bounceHeight < 0) {
              clearInterval(animation);
              this.setLatLng(originalLatLng);
              return;
            }
            this.setLatLng([
              originalLatLng.lat + bounceHeight * 0.0001,
              originalLatLng.lng,
            ]);
          }, 16);
        };

        newMarker.bounce();
        setMarker(newMarker);

        // Smoothly zoom to the clicked location
        mapInstance.flyTo([lat, lng], 16, {
          duration: 1,
        });

        // Reverse geocode the clicked location
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setSelectedLocation({
            address: data.display_name,
            lat,
            lon: lng,
          });
          onAddressSelect(data.display_name, lat, lng); // Pass address, lat, lng
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        }
      });

      setMap(mapInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, [isOpen, onAddressSelect]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setSearchResults(data);

      // If results found, zoom to the first result
      if (data.length > 0 && map) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.flyTo([lat, lon], 16, {
          duration: 1,
        });

        // Add marker for the first result
        if (marker) {
          marker.remove();
        }

        const newMarker = L.marker([lat, lon], {
          icon: customIcon,
          animate: true,
        }).addTo(map);

        newMarker.bounce();
        setMarker(newMarker);
      }
    } catch (error) {
      console.error("Error searching address:", error);
    }
  };

  const handleLocationSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    if (map) {
      map.flyTo([lat, lon], 16, { duration: 1 });

      if (marker) marker.remove();

      const newMarker = L.marker([lat, lon], {
        icon: customIcon,
        animate: true,
      }).addTo(map);
      newMarker.bounce();
      setMarker(newMarker);
    }

    setSelectedLocation({ address: location.display_name, lat, lon });
    setSearchResults([]);
    onAddressSelect(location.display_name, lat, lon); // Pass address, lat, lng
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-blue-500 text-sm hover:text-blue-600 flex items-center gap-1"
      >
        <MapPin className="w-4 h-4" />
        Or add your exact home address?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-xl mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Location on Map</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search address..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition duration-200 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition duration-200"
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}

              <div id="map" className="h-64 rounded-lg border border-gray-200">
                <div className="p-2 bg-white rounded-md shadow-sm absolute bottom-2 left-2 z-[1000] text-sm text-gray-600">
                  Click anywhere on the map to select location
                </div>
              </div>

              {selectedLocation && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Selected Location:</p>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.address}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                {selectedLocation && (
                  <button
                    onClick={() => {
                      handleClose();
                      onAddressSelect(
                        selectedLocation.address,
                        selectedLocation.lat,
                        selectedLocation.lon
                      ); // Pass address, lat, lng
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Select Address
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapAddressSelector;
