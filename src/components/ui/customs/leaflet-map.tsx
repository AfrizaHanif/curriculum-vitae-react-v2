"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMapInstance, Marker as LeafletMarkerInstance } from "leaflet";
import "./leaflet-map.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  popupContent?: string;
  iconClass?: string;
}

export interface LeafletMapProps {
  /** Center coordinates of the map [latitude, longitude] */
  center: [number, number];
  /** Default zoom level (default: 15) */
  zoom?: number;
  /** Array of marker items to display */
  markers?: MapMarker[];
  /** Height of the map container (e.g. "350px", "100%", or 400) */
  height?: string | number;
  /** Width of the map container (default: "100%") */
  width?: string | number;
  /** Enable or disable scroll wheel zooming (default: false to prevent accidental page scroll capture) */
  scrollWheelZoom?: boolean;
  /** Custom tile layer URL (defaults to OpenStreetMap tiles) */
  tileLayerUrl?: string;
  /** Attribution text (defaults to OpenStreetMap contributors) */
  attribution?: string;
  /** Additional container CSS class name */
  className?: string;
  /** Inline styles for the outer container */
  style?: React.CSSProperties;
  /** Trigger to force leaflet to recalculate container dimensions (e.g., when modal opens) */
  invalidateTrigger?: unknown;
}

export default function LeafletMap({
  center,
  zoom = 15,
  markers = [],
  height = "360px",
  width = "100%",
  scrollWheelZoom = false,
  tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  className = "",
  style,
  invalidateTrigger,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<LeafletMarkerInstance[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize Leaflet map client-side
  useEffect(() => {
    let isCancelled = false;

    if (!containerRef.current) return;

    // Dynamically import leaflet to avoid Next.js SSR window errors
    import("leaflet").then((L) => {
      if (isCancelled || !containerRef.current) return;

      // Clean up previous instance and container ID if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (containerRef.current && (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id) {
        delete (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id;
      }

      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom,
      });

      L.tileLayer(tileLayerUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsReady(true);

      const refreshMap = () => {
        if (!isCancelled && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.setView(center, zoom, { animate: false });
        }
      };

      // Staggered size recalculations during CSS/Modal animations (e.g. Bootstrap modal fade)
      const timers = [50, 150, 300, 450, 600, 900].map((delay) =>
        setTimeout(refreshMap, delay)
      );

      // Listen to Bootstrap modal shown event if inside a modal
      const modalParent = containerRef.current?.closest(".modal");
      if (modalParent) {
        modalParent.addEventListener("shown.bs.modal", refreshMap);
      }

      // Observe size changes via ResizeObserver
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined" && containerRef.current) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              refreshMap();
            }
          }
        });
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        timers.forEach(clearTimeout);
        if (modalParent) {
          modalParent.removeEventListener("shown.bs.modal", refreshMap);
        }
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (containerRef.current && (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id) {
        delete (containerRef.current as unknown as { _leaflet_id?: number })._leaflet_id;
      }
      setIsReady(false);
    };
    // Recreate map if center changes radically or core configuration changes
  }, [center[0], center[1], zoom, scrollWheelZoom, tileLayerUrl, attribution]);

  // Update markers and popups when map is ready or markers prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isReady) return;

    let isCancelled = false;

    import("leaflet").then((L) => {
      if (isCancelled || !mapInstanceRef.current) return;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const targetMarkers = markers.length > 0 ? markers : [{ lat: center[0], lng: center[1] }];

      targetMarkers.forEach((markerData) => {
        const iconHtml = `
          <div class="custom-marker-pulse"></div>
          <div class="custom-marker-pin">
            <i class="bi ${markerData.iconClass || "bi-geo-alt-fill"}"></i>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: iconHtml,
          iconSize: [30, 42],
          iconAnchor: [15, 38],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([markerData.lat, markerData.lng], {
          icon: customIcon,
          title: markerData.title,
        }).addTo(map);

        if (markerData.popupContent || markerData.title) {
          const content = `
            <div class="fw-bold fs-6 mb-1">${markerData.title || ""}</div>
            ${markerData.popupContent ? `<div class="text-secondary small">${markerData.popupContent}</div>` : ""}
          `;
          marker.bindPopup(content);
        }

        markersRef.current.push(marker);
      });

      // Ensure markers are properly positioned after adding
      map.invalidateSize();
      map.setView(center, zoom, { animate: false });
    });

    return () => {
      isCancelled = true;
    };
  }, [isReady, markers, center, zoom]);

  // Handle external resize or visibility triggers (e.g. modal opening)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timers = [50, 200, 400].map((delay) =>
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.setView(center, zoom, { animate: false });
        }
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [invalidateTrigger, height, width, center, zoom]);

  const formattedHeight = typeof height === "number" ? `${height}px` : height;
  const formattedWidth = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={`leaflet-map-wrapper ${className}`}
      style={{ height: formattedHeight, width: formattedWidth, ...style }}
    >
      <div ref={containerRef} className="leaflet-map-container" />
    </div>
  );
}
