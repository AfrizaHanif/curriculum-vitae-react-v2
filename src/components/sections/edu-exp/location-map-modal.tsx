"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/bootstrap/modal";
import Alert from "@/components/ui/bootstrap/alert";
import type { MapMarker } from "../../ui/customs/leaflet-map";
import { useLanguage } from "@/context/LanguageContext";

// Dynamic import for LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import("../../ui/customs/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex flex-column align-items-center justify-content-center bg-body-tertiary border rounded-3 text-muted"
      style={{ height: "380px", width: "100%" }}
    >
      <div
        className="spinner-border spinner-border-sm text-primary mb-2"
        role="status"
      />
      <span className="small">Loading map...</span>
    </div>
  ),
});

export interface LocationMapModalProps {
  id?: string;
  show: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | null;
  address?: string | null;
  latitude: number | string;
  longitude: number | string;
  icon?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function LocationMapModal({
  id = "location-map-modal",
  show,
  onClose,
  title,
  subtitle,
  address,
  latitude,
  longitude,
  icon = "bi-geo-alt-fill",
  size = "lg",
}: LocationMapModalProps) {
  const { t } = useLanguage();

  // Convert latitude and longitude to numbers
  const numLat = typeof latitude === "number" ? latitude : parseFloat(latitude);
  const numLng =
    typeof longitude === "number" ? longitude : parseFloat(longitude);

  // Check if coordinates are valid
  const isValidCoordinates = !isNaN(numLat) && !isNaN(numLng);

  // Create markers for map
  const markers: MapMarker[] = useMemo(() => {
    if (!isValidCoordinates) return [];
    return [
      {
        lat: numLat,
        lng: numLng,
        title,
        popupContent: address || subtitle || undefined,
        iconClass: icon,
      },
    ];
  }, [numLat, numLng, isValidCoordinates, title, address, subtitle, icon]);

  // External map links
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${numLat},${numLng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${numLat}&mlon=${numLng}#map=16/${numLat}/${numLng}`;

  return (
    <Modal
      id={id}
      show={show}
      onClose={onClose}
      title={title}
      size={size}
      centered
      scrollable
      bodyClassName="p-3 p-md-4"
      buttonItems={[
        // Open OpenStreetMap button
        ...(isValidCoordinates
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-1">
                    <i className="bi bi-map" />
                    <span>{t.sections.eduExp.mapModal.openOsm}</span>
                  </span>
                ),
                as: "a" as const,
                href: osmUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                color: "outline-secondary",
                size: "sm" as const,
                className: "me-auto",
              },
            ]
          : []),
        // Close button
        {
          label: t.common.close,
          color: "secondary",
          size: "sm",
          dismiss: true,
        },
        // Open Google Maps button
        ...(isValidCoordinates
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-1">
                    <i className="bi bi-box-arrow-up-right" />
                    <span>{t.sections.eduExp.mapModal.openGoogleMaps}</span>
                  </span>
                ),
                as: "a" as const,
                href: googleMapsUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                color: "primary",
                size: "sm" as const,
              },
            ]
          : []),
      ]}
    >
      <div>
        {/* Info header inside modal body */}
        <div className="d-flex flex-column gap-1 mb-3">
          {/* Subtitle */}
          {subtitle && (
            <span className="fw-semibold text-primary">{subtitle}</span>
          )}
          {/* Address */}
          {address && (
            <div className="d-flex align-items-start gap-2 text-secondary small">
              <i className="bi bi-pin-map text-danger mt-1 flex-shrink-0" />
              <span>{address}</span>
            </div>
          )}
          {/* Coordinates */}
          {isValidCoordinates && (
            <div className="text-muted small">
              <i className="bi bi-compass me-1" />
              <span>
                {t.sections.eduExp.mapModal.coordinates}: {numLat.toFixed(5)},{" "}
                {numLng.toFixed(5)}
              </span>
            </div>
          )}
        </div>

        {/* Leaflet Map Preview */}
        {isValidCoordinates ? (
          <LeafletMap
            key={`${numLat}-${numLng}`}
            center={[numLat, numLng]}
            zoom={15}
            markers={markers}
            height="380px"
            invalidateTrigger={show}
            scrollWheelZoom
          />
        ) : (
          <Alert color="warning" className="mb-0 text-center py-4">
            <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2 text-warning" />
            {t.sections.eduExp.mapModal.invalidCoordinates}
          </Alert>
        )}
      </div>
    </Modal>
  );
}
