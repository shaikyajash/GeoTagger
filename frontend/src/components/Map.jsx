import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

const MapComponent = () => {
  const [pins, setPins] = useState([]);
  const [temporaryPin, setTemporaryPin] = useState(null);
  const [tempDescription, setTempDescription] = useState("");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef();
  const tempMarkerRef = useRef();

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://geotagger-cwu7.onrender.com/pins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPins(response.data.pins);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };
    fetchPins();
  }, []);

  const addTemporaryPin = async (e) => {
    const { lat, lng } = e.latlng;
    const placeName = await getPlaceName(lat, lng);

    const tempPin = {
      id: uuidv4(), // Ensure unique ID for temporary pin
      position: e.latlng,
      description: "",
      placeName: placeName || "Unknown Location",
    };
    setTemporaryPin(tempPin);
  };

  const confirmPin = () => {
    if (temporaryPin) {
      setPins([...pins, { ...temporaryPin, description: tempDescription }]);
      setTemporaryPin(null);
      setTempDescription("");
    }
  };

  const getPlaceName = async (lat, lng) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: lat,
            lon: lng,
            format: "json",
          },
        }
      );
      if (response.data && response.data.display_name) {
        return response.data.display_name;
      } else {
        console.warn("No results found for the given coordinates.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
      return null;
    }
  };

  const searchLocation = async () => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchQuery,
            format: "json",
            addressdetails: 1,
            limit: 1,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 13);
      } else {
        console.warn("No results found for the search query.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchLocation();
  };

  const updatePinDescription = (id, description) => {
    setPins(pins.map((pin) => (pin.id === id ? { ...pin, description } : pin)));
  };

  const deletePin = (id) => {
    const updatedPins = pins.filter((pin) => pin.id !== id);
    setPins(updatedPins);
    savePins(updatedPins);
  };

  const savePins = (pinsToSave = pins) => {
    try {
      const token = localStorage.getItem("token");
      axios.post("https://geotagger-cwu7.onrender.com/pins", { pins: pinsToSave }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
    } catch (error) {
      console.error("Error saving pins:", error);
      alert("Failed to save pins. Please try again.");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      dblclick: addTemporaryPin,
      click: () => {
        if (temporaryPin) {
          setTemporaryPin(null);
          setTempDescription("");
        }
      },
    });
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-green-400 to-blue-500">
      <motion.div
        className="w-1/4 p-5 bg-white bg-opacity-80 backdrop-blur-md border-r-2 border-gray-300 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pins</h2>
        <ul className="space-y-4">
          {pins.map((pin) => (
            <li
              key={pin.id}
              className="p-3 bg-gray-100 border-2 border-gray-300 shadow-md rounded-lg transition-transform transform hover:scale-105"
            >
              <div>
                <strong>Location:</strong> {pin.placeName}
                <br />
                <strong>Description:</strong>{" "}
                {pin.description || "No description"}
              </div>
              <button
                onClick={() => deletePin(pin.id)}
                className="mt-2 w-full py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => savePins()}
          className="mt-6 w-full py-2 bg-gray-100 border-2 border-gray-300 shadow-md text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Save All Pins
        </button>
        <form onSubmit={handleSearchSubmit} className="mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search location"
            className="w-full h-10 rounded bg-gray-100 border-2 border-gray-300 px-3 text-gray-800 font-medium placeholder-gray-500 focus:border-blue-400 transition"
          />
          <button
            type="submit"
            className="mt-2 w-full py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Search
          </button>
        </form>
      </motion.div>
      <div className="w-3/4 h-screen">
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
            {pins.map((pin) => (
              <Marker key={pin.id} position={pin.position}>
                <Popup>
                  <div className="p-2 bg-gray-100 border-2 border-gray-300 shadow-md rounded-lg">
                    <strong>Location:</strong> {pin.placeName}
                    <br />
                    <input
                      type="text"
                      value={pin.description}
                      onChange={(e) =>
                        updatePinDescription(pin.id, e.target.value)
                      }
                      placeholder="Add description"
                      className="w-full mt-2 p-1 border-2 border-gray-300 rounded"
                    />
                  </div>
                </Popup>
              </Marker>
            ))}
            {temporaryPin && (
              <Marker
                position={temporaryPin.position}
                ref={tempMarkerRef}
                eventHandlers={{
                  add: () => {
                    if (tempMarkerRef.current) {
                      tempMarkerRef.current.openPopup();
                    }
                  },
                }}
              >
                <Popup>
                  <div className="p-2 bg-gray-100 border-2 border-gray-300 shadow-md rounded-lg">
                    <strong>Location:</strong> {temporaryPin.placeName}
                    <br />
                    <input
                      type="text"
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      placeholder="Add description"
                      className="w-full mt-2 p-1 border-2 border-gray-300 rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmPin();
                      }}
                      className="mt-2 w-full py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Add Pin
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default MapComponent;