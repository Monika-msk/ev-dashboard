import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { corridorDefs } from "./Data";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";

mapboxgl.accessToken = "pk.eyJ1IjoibW9uaWthbXNrIiwiYSI6ImNtY25ueDFmZjAxYjYycXM4YXI4Z2J0YmUifQ.IPGbA1CNqTHn1SJZm4pRPQ";
const directionsClient = mbxDirections({ accessToken: mapboxgl.accessToken });

const MapComponent = ({ selectedCorridor, selectedSites }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const siteMarkers = useRef([]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const drawRoute = (id, geometry, color) => {
    if (!mapRef.current.getSource(`corridor-${id}`)) {
      mapRef.current.addSource(`corridor-${id}`, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry,
        },
      });

      mapRef.current.addLayer({
        id: `corridor-layer-${id}`,
        type: "line",
        source: `corridor-${id}`,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": 4,
        },
      });
    }
  };

  const fetchRoute = async (corridor) => {
    const { id, src, dst, via } = corridor;
    const waypoints = via ? [src, via, dst] : [src, dst];

    const waypointData = waypoints.map(([lng, lat]) => ({
      coordinates: [lng, lat],
    }));

    try {
      const res = await directionsClient
        .getDirections({
          profile: "driving",
          geometries: "geojson",
          waypoints: waypointData,
        })
        .send();

      return res.body.routes[0].geometry;
    } catch (err) {
      console.error(`Error route ${id}:`, err);
      return null;
    }
  };

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [78.9629, 22.5937],
      zoom: 4.2,
    });

    mapRef.current.on("load", async () => {
      const chunkSize = 5;
      for (let i = 0; i < corridorDefs.length; i += chunkSize) {
        const chunk = corridorDefs.slice(i, i + chunkSize);
        const promises = chunk.map(fetchRoute);
        const results = await Promise.all(promises);

        results.forEach((route, index) => {
          if (route) {
            drawRoute(chunk[index].id, route, chunk[index].color);
          }
        });

        await sleep(1000);
      }
    });

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (!selectedCorridor || !mapRef.current) return;

    const { src, dst, via } = selectedCorridor;
    const bounds = new mapboxgl.LngLatBounds();

    [src, dst, ...(via ? [via] : []), ...selectedSites.map((s) => s.coordinates)]
      .forEach((coord) => bounds.extend(coord));

    mapRef.current.fitBounds(bounds, { padding: 80, duration: 1000 });

    siteMarkers.current.forEach((marker) => marker.remove());
    siteMarkers.current = [];

    selectedSites.forEach((site) => {
      const marker = new mapboxgl.Marker({ color: "#e17055" })
        .setLngLat(site.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <strong>${site.id}</strong><br/>
            Highway: ${site.highway}<br/>
            Size: ${site.siteSize}<br/>
            Amenities: ${site.amenities}<br/>
            Substation: ${site.substation}<br/>
            Renewables: ${site.renewables}<br/>
            Contact: <a href="mailto:${site.contact}">${site.contact}</a>
          `)
        )
        .addTo(mapRef.current);

      siteMarkers.current.push(marker);
    });
  }, [selectedCorridor, selectedSites]);

  return <div ref={mapContainer} className="map-container" />;
};

export default MapComponent;
