"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface FarmMapProps {
  lat?: number;
  lon?: number;
  onLocationSelect: (location: { lat: number; lon: number }) => void;
}

export default function FarmMapClient({
  lat = 3.6295,
  lon = -7.9811,
  onLocationSelect,
}: FarmMapProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    lat,
    lon,
  ]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarkerPosition(newPos);
        onLocationSelect({ lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={markerPosition}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={markerPosition} />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
