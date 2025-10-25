"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// ✅ Define proper type for Leaflet Routing Control
interface RoutingControl extends L.Control {
  getPlan(): unknown;
  getWaypoints(): L.Routing.Waypoint[];
  setWaypoints(waypoints: L.LatLng[]): this;
  route(): void;
}

interface GymMapProps {
  className?: string;
}

export default function GymMap({ className = '' }: GymMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routingControlRef = useRef<RoutingControl | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const isMapReadyRef = useRef(false);
  const [distance, setDistance] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Gym location coordinates
  const GYM_LOCATION: [number, number] = [14.3294, 120.9636];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(GYM_LOCATION, 13);
    mapRef.current = map;

    // Wait for map to be fully ready
    map.whenReady(() => {
      isMapReadyRef.current = true;
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom gym icon
    const gymIcon = L.divIcon({
      html: `
        <div style="position: relative;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; font-weight: bold;">
            Endless Grind Gym
          </div>
        </div>
      `,
      className: 'custom-gym-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Add gym marker
    L.marker(GYM_LOCATION, { icon: gymIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #f59e0b; font-weight: bold;">Endless Grind Gym</h3>
          <p style="margin: 0; font-size: 12px;">9015 @ Gen. Emilio Aguinaldo Highway<br/>
          Arcontica Subdivision Salitran 2<br/>
          Dasmariñas, Philippines</p>
        </div>
      `);

    // Get user's location
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          // Check if map still exists and is ready
          if (!mapRef.current || !isMapReadyRef.current) return;

          const { latitude, longitude } = position.coords;
          const userPos: [number, number] = [latitude, longitude];

          // Custom user location icon
          const userIcon = L.divIcon({
            html: `
              <div style="position: relative;">
                <div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>
                <div style="position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; transform: translate(-50%, -50%); animation: pulse 2s infinite;"></div>
              </div>
            `,
            className: 'custom-user-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          // Update or create user marker
          if (userMarkerRef.current && mapRef.current) {
            userMarkerRef.current.setLatLng(userPos);
          } else if (mapRef.current) {
            userMarkerRef.current = L.marker(userPos, { icon: userIcon })
              .addTo(mapRef.current)
              .bindPopup('<strong>Your Location</strong>');
          }

          // Calculate distance
          if (mapRef.current) {
            const dist = mapRef.current.distance(userPos, GYM_LOCATION);
            const distKm = (dist / 1000).toFixed(2);
            setDistance(distKm);
          }

          // Remove existing routing control
          if (routingControlRef.current && mapRef.current && isMapReadyRef.current) {
            try {
              const ctrl = routingControlRef.current;
              routingControlRef.current = null;
              mapRef.current.removeControl(ctrl);
            } catch {
              // Silently handle removal errors
            }
          }

          // Add routing with delay to ensure map is ready
          if (mapRef.current && isMapReadyRef.current) {
            setTimeout(() => {
              if (!mapRef.current || !isMapReadyRef.current) return;

              try {
                // ✅ Properly type the Leaflet Routing control
                const routingControl = (L as typeof L & {
                  Routing: {
                    control: (options: unknown) => RoutingControl;
                  };
                }).Routing.control({
                  waypoints: [
                    L.latLng(userPos[0], userPos[1]),
                    L.latLng(GYM_LOCATION[0], GYM_LOCATION[1])
                  ],
                  routeWhileDragging: false,
                  addWaypoints: false,
                  draggableWaypoints: false,
                  fitSelectedRoutes: true,
                  showAlternatives: false,
                  lineOptions: {
                    styles: [{ color: '#f59e0b', weight: 5, opacity: 0.7 }]
                  },
                  createMarker: () => null,
                });

                if (mapRef.current) {
                  routingControl.addTo(mapRef.current);
                  routingControlRef.current = routingControl;

                  // Hide the routing container/panel after a short delay
                  setTimeout(() => {
                    const routingContainer = document.querySelector('.leaflet-routing-container');
                    if (routingContainer) {
                      (routingContainer as HTMLElement).style.display = 'none';
                    }
                  }, 100);

                  // Fit bounds to show both locations
                  const bounds = L.latLngBounds([userPos, GYM_LOCATION]);
                  mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                }
              } catch {
                // Routing failed, but we can still show the map
                console.log('Routing not available');
              }
            }, 500);
          }

          setError('');
        },
        (err) => {
          setError('Unable to get your location. Please enable location services.');
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }

    // Add CSS for pulse animation and hide routing container
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      .leaflet-routing-container {
        display: none !important;
      }
      .leaflet-routing-alt {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      isMapReadyRef.current = false;

      // Clear geolocation watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      // Remove routing control first
      if (routingControlRef.current) {
        const ctrl = routingControlRef.current;
        routingControlRef.current = null;
        
        if (mapRef.current) {
          try {
            mapRef.current.removeControl(ctrl);
          } catch {
            // Silently handle cleanup errors
          }
        }
      }

      // Remove marker
      if (userMarkerRef.current) {
        const marker = userMarkerRef.current;
        userMarkerRef.current = null;
        
        if (mapRef.current) {
          try {
            mapRef.current.removeLayer(marker);
          } catch {
            // Silently handle cleanup errors
          }
        }
      }

      // Remove map
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch {
          // Silently handle cleanup errors
        }
      }

      // Remove style
      if (style.parentNode) {
        style.remove();
      }
    };
  }, [GYM_LOCATION]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-lg" />
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h3 className="font-bold text-lg text-amber-500 mb-2">📍 Find Us</h3>
        <p className="text-sm text-gray-700 mb-2">
          <strong>Endless Grind Gym</strong><br />
          9015 @ Gen. Emilio Aguinaldo Highway<br />
          Arcontica Subdivision Salitran 2<br />
          Dasmariñas, Philippines
        </p>
        {distance && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-semibold text-blue-600">
              📏 Distance: <span className="text-lg">{distance} km</span>
            </p>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
          <span className="text-xs font-medium">Gym Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium">Your Location</span>
        </div>
      </div>
    </div>
  );
}