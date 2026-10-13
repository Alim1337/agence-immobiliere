"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  priceLabel: string;
  href: string;
}

const ALGIERS_CENTER: [number, number] = [3.0588, 36.7538];

// Free OpenStreetMap raster tiles — no account, no API key required.
// For heavier production traffic, consider a dedicated tile provider
// (e.g. MapTiler free tier) with proper caching, per OSM's usage policy.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export function PropertyMap({
  markers,
  className,
  zoom = 11,
}: {
  markers: MapMarker[];
  className?: string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] =
      markers.length > 0
        ? [markers[0].longitude, markers[0].latitude]
        : ALGIERS_CENTER;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center,
      zoom: markers.length > 0 ? zoom : 11,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markerEls: maplibregl.Marker[] = [];

    const addMarkers = () => {
      markers.forEach((m) => {
        const el = document.createElement("a");
        el.href = m.href;
        el.style.display = "block";
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.borderRadius = "9999px";
        el.style.background = "#2f4a3e";
        el.style.border = "2px solid #f7f5f1";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        el.style.cursor = "pointer";

        const popup = new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(
          `<div style="font-family: sans-serif; font-size: 12px;">
             <strong>${m.title}</strong><br/>${m.priceLabel}
           </div>`
        );

        const marker = new maplibregl.Marker(el)
          .setLngLat([m.longitude, m.latitude])
          .setPopup(popup)
          .addTo(map);
        markerEls.push(marker);
      });

      if (markers.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        markers.forEach((m) => bounds.extend([m.longitude, m.latitude]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
      }
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }

    return () => {
      markerEls.forEach((m) => m.remove());
    };
  }, [markers]);

  return <div ref={containerRef} className={className} />;
}
