"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const originIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapInnerProps {
  markers?: {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    type?: "origin" | "destination" | "vehicle";
  }[];
  center: [number, number];
  zoom: number;
  className: string;
  showRoute: boolean;
}

function getIcon(type?: "origin" | "destination" | "vehicle") {
  switch (type) {
    case "origin":
      return originIcon;
    case "destination":
      return destinationIcon;
    case "vehicle":
      return vehicleIcon;
    default:
      return vehicleIcon;
  }
}

export default function MapInner({
  markers = [],
  center,
  zoom,
  className,
  showRoute,
}: MapInnerProps) {
  // Create polyline positions if showRoute is enabled
  const polylinePositions: [number, number][] = showRoute
    ? markers.map((m) => [m.lat, m.lng] as [number, number])
    : [];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`rounded-xl ${className}`}
      style={{ height: "100%", minHeight: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={getIcon(marker.type)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{marker.title}</p>
              {marker.description && (
                <p className="text-gray-600">{marker.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {showRoute && polylinePositions.length > 1 && (
        <Polyline
          positions={polylinePositions}
          color="#2563eb"
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}
