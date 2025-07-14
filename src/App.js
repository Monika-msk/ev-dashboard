import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./Sidebar";
import { corridorDefs, siteData } from "./Data";
import "./App.css";

mapboxgl.accessToken = "pk.eyJ1IjoibW9uaWthbXNrIiwiYSI6ImNtY25ueDFmZjAxYjYycXM4YXI4Z2J0YmUifQ.IPGbA1CNqTHn1SJZm4pRPQ";

const App = () => {
  const mapRef = useRef(null);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const siteMarkersRef = useRef([]);
  const routeCache = useRef({});
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");
  const [theme, setTheme] = useState("light");

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [78.9629, 22.5937], zoom: 4.3 });
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) =>
      prev.includes("streets-v11") ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/mapbox/streets-v11"
    );
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: mapStyle,
      center: [78.9629, 22.5937],
      zoom: 4.3,
    });

    mapRef.current = map;

    map.on("load", async () => {
      for (const corridor of corridorDefs) {
        const coords = [corridor.src];
        if (corridor.via) coords.push(corridor.via);
        coords.push(corridor.dst);
        const coordStr = coords.map((c) => c.join(",")).join(";");
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        const res = await fetch(url);
        const data = await res.json();
        const geometry = data.routes[0].geometry;

        routeCache.current[corridor.id] = geometry;

        map.addSource(`route-${corridor.id}`, {
          type: "geojson",
          data: { type: "Feature", geometry },
        });

        map.addLayer({
          id: `route-${corridor.id}`,
          type: "line",
          source: `route-${corridor.id}`,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": corridor.color, "line-width": 4 },
        });
      }
    });
  }, [mapStyle]);

  const handleCorridorSelect = async (corridorId) => {
    setSelectedCorridor(corridorId);
    const corridor = corridorDefs.find((c) => c.id === corridorId);
    const map = mapRef.current;

    const geometry = routeCache.current[corridorId];
    const bounds = geometry.coordinates.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(geometry.coordinates[0], geometry.coordinates[0])
    );
    map.fitBounds(bounds, { padding: 60 });

    siteMarkersRef.current.forEach((m) => m.remove());
    siteMarkersRef.current = [];

    const corridorSites = siteData.filter(
      (site) => site.corridor.replace(/\s/g, "") === corridor.name.replace(/\s/g, "")
    );

    corridorSites.forEach((site) => {
      const el = document.createElement("div");
      el.className = "custom-marker";

      const popupHTML = `
        <strong>Site ID:</strong> ${site.id}<br>
        <strong>Amenities:</strong> ${site.amenities}<br>
        <strong>Highway:</strong> ${site.highway}<br>
        <strong>Distance from Highway:</strong> ${site.distanceFromHighway}<br>
        <strong>Site Size:</strong> ${site.siteSize}<br>
        <strong>Substation:</strong> ${site.substation}<br>
        <strong>Renewables:</strong> ${site.renewables}<br>
        <strong>Contact:</strong> ${site.contact}
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(site.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
        .addTo(map);

      siteMarkersRef.current.push(marker);
    });
  };

  const zoomIn = () => mapRef.current && mapRef.current.zoomIn();
  const zoomOut = () => mapRef.current && mapRef.current.zoomOut();

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar
        corridors={corridorDefs}
        onSelect={handleCorridorSelect}
        selectedCorridor={selectedCorridor}
      />
      <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
      <div className="map-controls">
        <button onClick={zoomIn}>➕</button>
        <button onClick={zoomOut}>➖</button>
        <button onClick={resetMapView}>🔄</button>
        <button onClick={toggleMapStyle}>🗺️</button>
        <button onClick={toggleTheme}>🌓</button>
      </div>
    </div>
  );
};

export default App;
