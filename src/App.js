import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from './Sidebar';
import './Sidebar.css';
import './App.css';
import { corridorDefs, siteData } from './Data';
import * as XLSX from 'xlsx';


mapboxgl.accessToken = 'pk.eyJ1IjoibW9uaWthbXNrIiwiYSI6ImNtY25ueDFmZjAxYjYycXM4YXI4Z2J0YmUifQ.IPGbA1CNqTHn1SJZm4pRPQ';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  const [selectedCorridorId, setSelectedCorridorId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const markersRef = useRef([]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const removeAllCorridors = (targetMap) => {
    for (let corridor of corridorDefs) {
      const sourceId = `route-${corridor.id}`;
      const layerId = `route-${corridor.id}`;
      if (targetMap.getLayer(layerId)) targetMap.removeLayer(layerId);
      if (targetMap.getSource(sourceId)) targetMap.removeSource(sourceId);
    }
  };

  const addCorridors = async (targetMap) => {
    removeAllCorridors(targetMap);
    for (let corridor of corridorDefs) {
      const coords = [corridor.src];
      if (corridor.via) coords.push(corridor.via);
      coords.push(corridor.dst);
      const waypoints = coords.map(c => `${c[0]},${c[1]}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const route = data.routes[0].geometry;

        targetMap.addSource(`route-${corridor.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: route },
        });

        targetMap.addLayer({
          id: `route-${corridor.id}`,
          type: 'line',
          source: `route-${corridor.id}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': corridor.color || '#000',
            'line-width': 4,
            'line-opacity': 0.85,
          },
        });
      } catch (error) {
        console.error('Error loading corridor:', corridor.id, error);
      }
    }
  };

  const showMarkers = (corridorId) => {
    clearMarkers();
    if (!corridorId) return;
    const corridorName = corridorDefs.find(c => c.id === corridorId)?.name;
    const normalize = (str) => str?.replace(/\s*[–-]\s*/g, '-');
    const filteredSites = siteData.filter(site => normalize(site.corridor) === normalize(corridorName));

    filteredSites.forEach(site => {
      const el = document.createElement('div');
      el.innerHTML = `<svg height="40" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="red" stroke="white" stroke-width="2"><path d="M12 21c-5-6.1-7-10.3-7-13a7 7 0 0114 0c0 2.7-2 6.9-7 13z"/><circle cx="12" cy="10" r="3"/></svg>`;
      el.style.cursor = 'pointer';

      const popupContent = `<strong>Site ID:</strong> ${site.id}<br/><strong>Corridor:</strong> ${site.corridor}<br/><strong>Highway:</strong> ${site.highway}<br/><strong>Distance:</strong> ${site.distanceFromHighway}<br/><strong>Size:</strong> ${site.siteSize}<br/><strong>Amenities:</strong> ${site.amenities}<br/><strong>Substation:</strong> ${site.substation}<br/><strong>Renewables:</strong> ${site.renewables}<br/><strong>Contact:</strong> ${site.contact}`;
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el).setLngLat(site.coordinates).setPopup(popup).addTo(map.current);
      markersRef.current.push(marker);
    });
  };

  const zoomToCorridor = async (corridor) => {
    const coords = [corridor.src];
    if (corridor.via) coords.push(corridor.via);
    coords.push(corridor.dst);
    const waypoints = coords.map(c => `${c[0]},${c[1]}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0].geometry;

    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach(coord => bounds.extend(coord));
    map.current.fitBounds(bounds, { padding: 80, duration: 1500 });
  };

  const zoomToSite = (site) => {
    clearMarkers();
    const el = document.createElement('div');
    el.innerHTML = `<svg height="40" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="red" stroke="white" stroke-width="2"><path d="M12 21c-5-6.1-7-10.3-7-13a7 7 0 0114 0c0 2.7-2 6.9-7 13z"/><circle cx="12" cy="10" r="3"/></svg>`;
    el.style.cursor = 'pointer';

    const popupContent = `<strong>Site ID:</strong> ${site.id}<br/><strong>Corridor:</strong> ${site.corridor}<br/><strong>Highway:</strong> ${site.highway}<br/><strong>Distance:</strong> ${site.distanceFromHighway}<br/><strong>Size:</strong> ${site.siteSize}<br/><strong>Amenities:</strong> ${site.amenities}<br/><strong>Substation:</strong> ${site.substation}<br/><strong>Renewables:</strong> ${site.renewables}<br/><strong>Contact:</strong> ${site.contact}`;
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
    const marker = new mapboxgl.Marker(el).setLngLat(site.coordinates).setPopup(popup).addTo(map.current);
    markersRef.current.push(marker);
    marker.togglePopup();

    map.current.flyTo({ center: site.coordinates, zoom: 10 });
  };

  const resetMap = () => {
    setSelectedCorridorId(null);
    clearMarkers();
    map.current?.flyTo({ center: [82.8, 22.6], zoom: 4 });
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    clearMarkers();
    if (!query) {
      resetMap();
      return;
    }

    const corridorById = corridorDefs.find(c => c.id.toLowerCase() === query);
    const corridorByName = corridorDefs.find(c => c.name.toLowerCase().includes(query));
    const site = siteData.find(s => s.id.toLowerCase() === query);

    if (corridorById) {
      setSelectedCorridorId(corridorById.id);
      showMarkers(corridorById.id);
      zoomToCorridor(corridorById);
    } else if (corridorByName) {
      setSelectedCorridorId(corridorByName.id);
      showMarkers(corridorByName.id);
      zoomToCorridor(corridorByName);
    } else if (site) {
      setSelectedCorridorId(null);
      zoomToSite(site);
    } else {
      alert("No match found.");
      resetMap();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    resetMap();
  };

  const toggleSatellite = () => {
    const next = mapStyle === 'mapbox://styles/mapbox/streets-v11'
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/streets-v11';
    setMapStyle(next);
    map.current.setStyle(next);
  };

  const onSelectCorridor = (id) => {
    if (id === selectedCorridorId) {
      resetMap();
    } else {
      setSelectedCorridorId(id);
      const corridor = corridorDefs.find(c => c.id === id);
      if (corridor) {
        showMarkers(id);
        zoomToCorridor(corridor);
      }
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(siteData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SiteData");
    XLSX.writeFile(workbook, "EV_Site_Data.xlsx");
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [82.8, 22.6],
      zoom: 4,
    });
    map.current.on('load', () => addCorridors(map.current));
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const onStyleLoad = () => addCorridors(map.current);
    map.current.once('styledata', onStyleLoad);
  }, [mapStyle]);

  return (
    <div className="app-container">
      <Sidebar selectedCorridorId={selectedCorridorId} onSelectCorridor={onSelectCorridor} />

      <div className="map-search-box">
        <input
          type="text"
          placeholder="Search corridor ID, name, or site ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        {searchQuery && <button onClick={handleReset} title="Clear">❌</button>}
      </div>

      <div ref={mapContainer} className="map-container" />

      <div className="map-buttons">
        <button onClick={() => map.current.zoomIn()}>➕</button>
        <button onClick={() => map.current.zoomOut()}>➖</button>
        <button onClick={handleReset}>🔄</button>
        <button onClick={toggleSatellite}>🌍</button>
        <button onClick={() => setShowTable(true)}>📊</button>
        <button onClick={exportToExcel}>📥</button>
      </div>

      {showTable && (
        <div className="fullscreen-table">
          <div className="table-header">
            <h2>Site Data</h2>
            <button onClick={() => setShowTable(false)} className="close-btn">❌</button>
          </div>

          <div className="table-search">
            <input
              type="text"
              placeholder="Search by any field (e.g. F2, NH 32, solar)..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th><th>Corridor</th><th>Highway</th><th>Distance</th><th>Size</th>
                <th>Amenities</th><th>Substation</th><th>Renewables</th><th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {siteData.filter(site =>
                Object.values(site).some(val =>
                  String(val).toLowerCase().includes(tableSearch.toLowerCase())
                )
              ).map(site => (
                <tr key={site.id}>
                  <td>{site.id}</td><td>{site.corridor}</td><td>{site.highway}</td>
                  <td>{site.distanceFromHighway}</td><td>{site.siteSize}</td><td>{site.amenities}</td>
                  <td>{site.substation}</td><td>{site.renewables}</td><td>{site.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}