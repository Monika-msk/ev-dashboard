import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { corridorDefs, siteData } from "./Data";
import Sidebar from "./Sidebar";
import "./App.css";

mapboxgl.accessToken = "pk.eyJ1IjoibW9uaWthbXNrIiwiYSI6ImNtY25ueDFmZjAxYjYycXM4YXI4Z2J0YmUifQ.IPGbA1CNqTHn1SJZm4pRPQ"; // ◀— replace with your own if needed

export default function App() {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const [selectedCorridor, setSelectedCorridor] = useState(null);

  // Build GeoJSON sources *once* for performance
  const corridorFeatures = useMemo(
    () =>
      corridorDefs.map((c) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: c.via ? [c.src, c.via, c.dst] : [c.src, c.dst]
        },
        properties: { id: c.id, color: c.color }
      })),
    []
  );

  useEffect(() => {
    if (mapRef.current) return; // prevent re‑init on re‑render
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [78.9629, 22.5937], // Centre of India
      zoom: 4
    });

    // Add all corridor lines
    mapRef.current.on("load", () => {
      mapRef.current.addSource("corridors", {
        type: "geojson",
        data: { type: "FeatureCollection", features: corridorFeatures }
      });

      // Display every corridor in its own colour
      mapRef.current.addLayer({
        id: "corridor-lines",
        type: "line",
        source: "corridors",
        paint: {
          "line-width": 4,
          "line-color": ["get", "color"],
          "line-opacity": 0.8
        }
      });
    });
  }, [corridorFeatures]);

  // === Handle corridor selection ===
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove previous site markers
    if (mapRef.current && mapRef.current.getCanvas) {
  mapRef.current.getCanvas().style.cursor = "";
}

    if (mapRef.current && mapRef.current.queryRenderedFeatures) {
  mapRef.current.queryRenderedFeatures({ layers: ["site-markers"] });
}


    // Remove old site layer if it exists
    if (mapRef.current.getLayer("site-markers")) {
      mapRef.current.removeLayer("site-markers");
    }
    if (mapRef.current.getSource("sites")) {
      mapRef.current.removeSource("sites");
    }

    if (!selectedCorridor) return;

    // 1. Zoom & fly to the selected line
    const c = selectedCorridor;
    const coordinates = c.via ? [c.src, c.via, c.dst] : [c.src, c.dst];
    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );
    mapRef.current.fitBounds(bounds, { padding: 80, duration: 900 });

    // 2. Add site markers for this corridor
    const sitesForCorridor = siteData.filter(
      (s) => s.corridor.replace(/\s+/g, "") === c.name.replace(/\s+/g, "")
    );

    mapRef.current.addSource("sites", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: sitesForCorridor.map((s) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: s.coordinates },
          properties: { id: s.id, label: `${s.id} – ${s.amenities}` }
        }))
      }
    });

    mapRef.current.addLayer({
      id: "site-markers",
      type: "circle",
      source: "sites",
      paint: {
        "circle-radius": 6,
        "circle-color": "#222",
        "circle-stroke-width": 2,
        "circle-stroke-color": "white"
      }
    });

    // Optional: popup on click
    mapRef.current.on("click", "site-markers", (e) => {
      const { coordinates } = e.features[0].geometry;
      const { label } = e.features[0].properties;
      new mapboxgl.Popup().setLngLat(coordinates).setText(label).addTo(mapRef.current);
    });
  }, [selectedCorridor]);

  return (
    <div className="app">
      <Sidebar
        corridors={corridorDefs}
        activeId={selectedCorridor?.id}
        onSelect={(c) => setSelectedCorridor(c)}
      />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
