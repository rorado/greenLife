"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FarmMapPage = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          console.warn("Geolocation denied, using default location.");
          setLocation({ lat: 38.58, lon: -121.49 });
          setLoading(false);
        },
      );
    } else {
      console.warn("Geolocation not supported, using default location.");
      setLocation({ lat: 38.58, lon: -121.49 });
      setLoading(false);
    }
  }, []);

  if (loading || !location) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[location.lat, location.lon]}>
          <Popup>Your Farm Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default FarmMapPage;
