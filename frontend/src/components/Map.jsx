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
import './Map.css';
import L from 'leaflet';

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

  const customIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [41, 61],
    iconAnchor: [22, 61],
    popupAnchor: [1, -34],
    shadowSize: [41, 61],
  });

  const addTemporaryPin = async (e) => {
    const { lat, lng } = e.latlng;
    const placeName = await getPlaceName(lat, lng);

    const tempPin = {
      id: uuidv4(),
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
    setPins(pins.map((pin) => (pin._id === id || pin.id === id ? { ...pin, description } : pin)));
  };

  const deletePin = (id) => {
    const updatedPins = pins.filter((pin) => pin._id !== id && pin.id !== id);
    setPins(updatedPins);
    savePins(updatedPins);
  };

  const savePins = async (pinsToSave) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://geotagger-cwu7.onrender.com/pins", { pins: pinsToSave }, {
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
    <div className="map-container">
      <motion.div
        className="sidebar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="sidebar-title">Pins</h2>
        <ul className="pin-list">
          {pins.map((pin, index) => (
            <li key={pin._id || pin.id || index} className="pin-item">
              <div>                                      
                <strong>Location:</strong> {pin.placeName}
                <br />
                <strong>Description:</strong>{" "}
                {pin.description || "No description"}
              </div>
              <button
                onClick={() => deletePin(pin._id || pin.id)}
                className="btn delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => savePins(pins)} className="btn save-btn">
          Save All Pins
        </button>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search location"
            className="search-input"
          />
          <button type="submit" className="btn search-btn">
            Search
          </button>
        </form>
      </motion.div>
      <div className="map-view">
        <motion.div
          className="map-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="map"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
            {pins.map((pin, index) => (
              <Marker key={pin._id || pin.id || index} position={pin.position} icon={customIcon}>
                <Popup>
                  <div className="popup-content">
                    <strong>Location:</strong> {pin.placeName}
                    <br />
                    <input
                      type="text"
                      value={pin.description}
                      onChange={(e) =>
                        updatePinDescription(pin._id || pin.id, e.target.value)
                      }
                      placeholder="Add description"
                      className="popup-input"
                    />
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default MapComponent;
