"use client";

import React, { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues
interface MapProps {
  markers?: {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    type?: "origin" | "destination" | "vehicle";
  }[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showRoute?: boolean;
}

export default function TripMap({
  markers = [],
  center = [40.7128, -74.006], // NYC default
  zoom = 10,
  className = "",
  showRoute = false,
}: MapProps) {
  const [Map, setMap] = useState<React.ComponentType<MapInnerProps> | null>(null);

  useEffect(() => {
    // Dynamic import for client-side only
    import("./MapInner").then((mod) => {
      setMap(() => mod.default);
    });
  }, []);

  if (!Map) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return <Map markers={markers} center={center} zoom={zoom} className={className} showRoute={showRoute} />;
}

interface MapInnerProps {
  markers: MapProps["markers"];
  center: [number, number];
  zoom: number;
  className: string;
  showRoute: boolean;
}
