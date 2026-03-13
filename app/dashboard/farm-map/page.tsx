"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FarmMapPage = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    accuracy: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: 38.58, lon: -121.49, accuracy: 0 });
      setLoading(false);
      return;
    }

    let bestLocation: GeolocationPosition | null = null;

    const success = (position: GeolocationPosition) => {
      if (
        !bestLocation ||
        position.coords.accuracy < bestLocation.coords.accuracy
      ) {
        bestLocation = position;
      }

      if (position.coords.accuracy <= 10) {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        navigator.geolocation.clearWatch(watchId);
      }
    };

    const error = () => {
      console.warn("Could not get location, using default.");
      setLocation({ lat: 38.58, lon: -121.49, accuracy: 0 });
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });

    // Safety: after 10 seconds, use the best location we have
    const timeoutId = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      if (bestLocation) {
        setLocation({
          lat: bestLocation.coords.latitude,
          lon: bestLocation.coords.longitude,
          accuracy: bestLocation.coords.accuracy,
        });
      } else {
        setLocation({ lat: 38.58, lon: -121.49, accuracy: 0 });
      }
      setLoading(false);
    }, 10000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading || !location) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Getting your exact location...
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[location.lat, location.lon]}>
          <Popup>Your exact farm location</Popup>
        </Marker>
        {location.accuracy > 0 && (
          <Circle
            center={[location.lat, location.lon]}
            radius={location.accuracy}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default FarmMapPage;
