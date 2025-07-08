import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibW9uaWthbXNrIiwiYSI6ImNtY25ueDFmZjAxYjYycXM4YXI4Z2J0YmUifQ.IPGbA1CNqTHn1SJZm4pRPQ'; 
const corridorDefs = [ 
    { id: 'A', name: 'Chennai–Villupuram', src: [80.2707, 13.0827], dst: [79.4994, 11.9401], color: '#4B7BEC' },
  { id: 'B', name: 'Delhi–Jaipur', src: [77.1025, 28.7041], dst: [75.7873, 26.9124], color: '#2D98DA' },
  { id: 'C', name: 'Vijayawada–Visakhapatnam', src: [80.6480, 16.5062], dst: [83.2185, 17.6868], color: '#20BF6B' },
  { id: 'D', name: 'Chennai–Bengaluru', src: [80.2707, 13.0827], dst: [77.5946, 12.9716], color: '#A55EEA' },
  { id: 'E', name: 'Coimbatore–Kochi', src: [76.9553, 11.0168], dst: [76.2673, 9.9312], color: '#FC5C65' },
  { id: 'F', name: 'Coimbatore–Salem', src: [76.9553, 11.0168], dst: [78.1510, 11.6643], color: '#778CA3' },
  { id: 'G', name: 'Kolkata–Haldia', src: [88.3639, 22.5726], dst: [88.1167, 22.0333], color: '#F7B731' },
  { id: 'H', name: 'Delhi–Chandigarh', src: [77.1025, 28.7041], dst: [76.7794, 30.7333], color: '#B2BEC3' },
  { id: 'I', name: 'Dhanbad–Kolkata', src: [86.4304, 23.7957], dst: [88.3639, 22.5726], color: '#4B6584' },
  { id: 'J', name: 'Pune–Nashik', src: [73.8567, 18.5204], dst: [73.7898, 19.9975], color: '#55E6C1' },
{ id: 'K', name: 'Delhi – Agra', src: [77.1025, 28.7041], dst: [78.0081, 27.1767], color: '#E17055' },
{ id: 'L', name: 'Paradeep – Barbil', src: [86.6100, 20.3167], dst: [85.3967, 22.1006], color: '#00CEC9' },
{ id: 'M', name: 'Ahmedabad – Mundra', src: [72.5714, 23.0225], dst: [69.7190, 22.8392], color: '#6C5CE7' },
{ id: 'N', name: 'Vijayawada – Hyderabad', src: [80.6480, 16.5062], dst: [78.4867, 17.3850], color: '#FAB1A0' },
{ id: 'O', name: 'Mumbai – Nashik', src: [72.8777, 19.0760], dst: [73.7898, 19.9975], color: '#81ECEC' },
{
  id: 'P',
  name: 'Dhanbad – Ranchi – Jamshedpur',
  src: [86.4304, 23.7957],             // Dhanbad
  mid: [85.3333, 23.3441],             // Ranchi (waypoint)
  dst: [86.2029, 22.8046],             // Jamshedpur
  color: '#FD79A8'

},
{ id: 'Q', name: 'Pune – Kolhapur', src: [73.8567, 18.5204], dst: [74.2333, 16.7050], color: '#74B9FF' },
{ id: 'R', name: 'Surat – Vadodara', src: [72.8311, 21.1702], dst: [73.1812, 22.3072], color: '#D63031' },
{ id: 'S', name: 'Hubballi – Chitradurga', src: [75.1240, 15.3647], dst: [76.4039, 14.2222], color: '#00B894' },
{ id: 'T', name: 'JNPT/Navi Mumbai – Pune', src: [73.0280, 18.9467], dst: [73.8567, 18.5204], color: '#636E72' },
{ id: 'U', name: 'Visakhapatnam – Brahmapur', src: [83.2185, 17.6868], dst: [84.7941, 19.3115], color: '#E84393' },
{ id: 'V', name: 'Chandigarh – Ludhiana – Amritsar', src: [76.7794, 30.7333], dst: [74.8723, 31.6340], color: '#FDCB6E' },
{ id: 'W', name: 'Chennai – Ongole', src: [80.2707, 13.0827], dst: [80.0483, 15.5036], color: '#A29BFE' },
{ id: 'X', name: 'Ambala – Jalandhar', src: [76.8343, 30.3782], dst: [75.5762, 31.3260], color: '#FF7675' }
 ];

const siteData = [  {
    id: 'A1',
    coordinates: [79.9053, 12.5144],
    corridor: 'Chennai – Villupuram',
    highway: 'NH 32',
    distanceFromHighway: '2.6 km',
    siteSize: '2000 m²',
    amenities: 'Petrol pump, dhaba, truck halt',
    substation: 'TANGEDCO Madurantakam (~1.8 km)',
    renewables: 'Nearby rooftop solar',
    contact: 'tangedco.madurantakam@tn.gov.in'
  },
  {
    id: 'A2',
    coordinates: [79.8384, 12.3962],
    corridor: 'Chennai – Villupuram',
    highway: 'NH 32',
    distanceFromHighway: '2.2 km',
    siteSize: '2200 m²',
    amenities: 'Café, parking, fuel station nearby',
    substation: 'TANGEDCO Melmaruvathur (~1.5 km)',
    renewables: 'NA',
    contact: 'tangedco.melmaruvathur@tn.gov.in'
  },
  {
    id: 'A3',
    coordinates: [79.6511, 12.2436],
    corridor: 'Chennai – Villupuram',
    highway: 'NH 32',
    distanceFromHighway: '2.7 km',
    siteSize: '2100 m²',
    amenities: 'Workshop, truck rest stop',
    substation: 'TANGEDCO Tindivanam (~2 km)',
    renewables: 'Canal-top nearby',
    contact: 'tangedco.tindivanam@tn.gov.in'
  },
  {
    id: 'B1',
    coordinates: [76.9947, 28.4526],
    corridor: 'Delhi – Jaipur',
    highway: 'NH 48',
    distanceFromHighway: '2.3 km',
    siteSize: '2100 m²',
    amenities: 'Truck bay, HP fuel',
    substation: 'HVPNL Gurgaon (~1.8 km)',
    renewables: 'NA',
    contact: 'hvpnl.gurgaon@haryana.gov.in'
  },
  {
    id: 'B2',
    coordinates: [76.8024, 28.2072],
    corridor: 'Delhi – Jaipur',
    highway: 'NH 48',
    distanceFromHighway: '2.7 km',
    siteSize: '2300 m²',
    amenities: 'Petrol pump, dhaba, parking',
    substation: 'HVPNL Dharuhera (~1.6 km)',
    renewables: 'Rooftop solar nearby',
    contact: 'hvpnl.dharuhera@haryana.gov.in'
  },
  {
    id: 'B3',
    coordinates: [76.3976, 27.9936],
    corridor: 'Delhi – Jaipur',
    highway: 'NH 48',
    distanceFromHighway: '2.8 km',
    siteSize: '2400 m²',
    amenities: 'Industrial zone, café, fuel, repair shop',
    substation: 'RVPN Neemrana (~2.3 km)',
    renewables: 'Rooftop solar by nearby industries',
    contact: 'rvpn.neemrana@rajasthan.gov.in'
  },
  {
    id: 'B4',
    coordinates: [75.9702, 27.3895],
    corridor: 'Delhi – Jaipur',
    highway: 'NH 48',
    distanceFromHighway: '2.5 km',
    siteSize: '2100 m²',
    amenities: 'Fuel station, parking, dhaba',
    substation: 'RVPN Shahpura (~1.9 km)',
    renewables: 'NA',
    contact: 'rvpn.shahpura@rajasthan.gov.in'
  },
  {
    id: 'B5',
    coordinates: [75.8903, 26.9122],
    corridor: 'Delhi – Jaipur',
    highway: 'NH 48',
    distanceFromHighway: '2.4 km',
    siteSize: '2200 m²',
    amenities: 'City outskirt zone, food, truck rest',
    substation: 'JVVNL Jaipur East (~1.5 km)',
    renewables: 'Rooftop solar visible',
    contact: 'jvvnl.jaipureast@rajasthan.gov.in'
  },
  {
    id: 'C1',
    coordinates: [80.6327, 16.5205],
    corridor: 'Vijayawada – Visakhapatnam',
    highway: 'NH 16',
    distanceFromHighway: '2.4 km',
    siteSize: '2200 m²',
    amenities: 'Petrol bunk, food zone, auto repair',
    substation: 'APEPDCL Guntur (~1.9 km)',
    renewables: 'Rooftop solar active',
    contact: 'apepdcl.guntur@ap.gov.in'
  },
  {
    id: 'C2',
    coordinates: [81.9632, 16.9835],
    corridor: 'Vijayawada – Visakhapatnam',
    highway: 'NH 16',
    distanceFromHighway: '2.7 km',
    siteSize: '2300 m²',
    amenities: 'Dhaba, EV feeder, halt zone',
    substation: 'APEPDCL Rajahmundry (~1.5 km)',
    renewables: 'NA',
    contact: 'apepdcl.rajahmundry@ap.gov.in'
  },
  {
    id: 'C3',
    coordinates: [83.2185, 17.6868],
    corridor: 'Vijayawada – Visakhapatnam',
    highway: 'NH 16',
    distanceFromHighway: '2.5 km',
    siteSize: '2400 m²',
    amenities: 'Truck halt, garage, fuel',
    substation: 'APEPDCL Anakapalle (~2.0 km)',
    renewables: 'Canal-top solar nearby',
    contact: 'apepdcl.anakapalle@ap.gov.in'
  },
   {
    id: 'D1',
    coordinates: [80.0896, 13.0160],
    corridor: 'Chennai – Bengaluru',
    highway: 'NH 48',
    distanceFromHighway: '2.5 km',
    siteSize: '2100 m²',
    amenities: 'Highway motel, workshop, fuel',
    substation: 'TANGEDCO Sriperumbudur (~1.8 km)',
    renewables: 'Solar rooftops nearby',
    contact: 'tangedco.sriperumbudur@tn.gov.in'
  },
  {
    id: 'D2',
    coordinates: [78.8308, 12.9347],
    corridor: 'Chennai – Bengaluru',
    highway: 'NH 48',
    distanceFromHighway: '2.9 km',
    siteSize: '2300 m²',
    amenities: 'Truck repair bay, dhaba',
    substation: 'TANGEDCO Vellore (~2.1 km)',
    renewables: 'NA',
    contact: 'tangedco.vellore@tn.gov.in'
  },
  {
    id: 'D3',
    coordinates: [77.7026, 12.9573],
    corridor: 'Chennai – Bengaluru',
    highway: 'NH 48',
    distanceFromHighway: '2.3 km',
    siteSize: '2400 m²',
    amenities: 'Industrial hub, parking zone',
    substation: 'KPTCL Hoskote (~1.7 km)',
    renewables: 'Rooftop PV in area',
    contact: 'kptcl.hoskote@karnataka.gov.in'
  },
  {
    id: 'E1',
    coordinates: [76.9543, 11.0084],
    corridor: 'Coimbatore – Kochi',
    highway: 'NH 544',
    distanceFromHighway: '2.1 km',
    siteSize: '2100 m²',
    amenities: 'Petrol pump, workshop, rest stop',
    substation: 'TANGEDCO Coimbatore North (~1.6 km)',
    renewables: 'Solar rooftops nearby',
    contact: 'tangedco.coimbatore@tn.gov.in'
  },
  {
    id: 'E2',
    coordinates: [76.6854, 10.6211],
    corridor: 'Coimbatore – Kochi',
    highway: 'NH 544',
    distanceFromHighway: '2.4 km',
    siteSize: '2300 m²',
    amenities: 'Dhaba cluster, service stop',
    substation: 'KSEB Palakkad (~2.0 km)',
    renewables: 'Canal-top solar visible',
    contact: 'kseb.palakkad@kerala.gov.in'
  },
  {
    id: 'E3',
    coordinates: [76.3578, 10.0167],
    corridor: 'Coimbatore – Kochi',
    highway: 'NH 544',
    distanceFromHighway: '2.5 km',
    siteSize: '2400 m²',
    amenities: 'Logistics depot, EV halt',
    substation: 'KSEB Aluva (~1.8 km)',
    renewables: 'Floating solar in area',
    contact: 'kseb.aluva@kerala.gov.in'
  },
  {
    id: 'E4',
    coordinates: [76.2859, 9.9764],
    corridor: 'Coimbatore – Kochi',
    highway: 'NH 544',
    distanceFromHighway: '2.2 km',
    siteSize: '2200 m²',
    amenities: 'EV rest station, truck lounge',
    substation: 'KSEB Kalamassery (~2.1 km)',
    renewables: 'NA',
    contact: 'kseb.kalamassery@kerala.gov.in'
  },
  {
    id: 'E5',
    coordinates: [76.2673, 9.9312],
    corridor: 'Coimbatore – Kochi',
    highway: 'NH 544',
    distanceFromHighway: '2.3 km',
    siteSize: '2000 m²',
    amenities: 'Fuel, restaurant, café',
    substation: 'KSEB Kochi Central (~2.2 km)',
    renewables: 'Rooftop installations nearby',
    contact: 'kseb.kochi@kerala.gov.in'
  },
  {
    id: 'F1',
    coordinates: [77.0014, 11.0602],
    corridor: 'Coimbatore – Salem',
    highway: 'NH 544',
    distanceFromHighway: '2.0 km',
    siteSize: '2100 m²',
    amenities: 'Fuel station, stopover, tire shop',
    substation: 'TANGEDCO Tirupur (~1.8 km)',
    renewables: 'NA',
    contact: 'tangedco.tirupur@tn.gov.in'
  },
  {
    id: 'F2',
    coordinates: [77.5673, 11.2356],
    corridor: 'Coimbatore – Salem',
    highway: 'NH 544',
    distanceFromHighway: '2.7 km',
    siteSize: '2200 m²',
    amenities: 'Food court, driver rest',
    substation: 'TANGEDCO Erode (~2.2 km)',
    renewables: 'Rooftop and canal-top',
    contact: 'tangedco.erode@tn.gov.in'
  },
  {
    id: 'F3',
    coordinates: [78.1510, 11.6643],
    corridor: 'Coimbatore – Salem',
    highway: 'NH 544',
    distanceFromHighway: '2.6 km',
    siteSize: '2300 m²',
    amenities: 'Logistics entry zone',
    substation: 'TANGEDCO Salem (~1.5 km)',
    renewables: 'Solar rooftops nearby',
    contact: 'tangedco.salem@tn.gov.in'
  },
  {
    id: 'G1',
    coordinates: [88.3639, 22.5726],
    corridor: 'Kolkata – Haldia',
    highway: 'NH 41',
    distanceFromHighway: '2.4 km',
    siteSize: '2100 m²',
    amenities: 'Port rest area, city fuel, food',
    substation: 'WBSEDCL Kolkata Central (~1.9 km)',
    renewables: 'Urban rooftop PV',
    contact: 'wbsedcl.kolkata@wb.gov.in'
  },
  {
    id: 'G2',
    coordinates: [88.1167, 22.0333],
    corridor: 'Kolkata – Haldia',
    highway: 'NH 41',
    distanceFromHighway: '2.3 km',
    siteSize: '2200 m²',
    amenities: 'Dockside hub, heavy halt zone',
    substation: 'Haldia Port Grid (~1.7 km)',
    renewables: 'Floating solar in Haldia',
    contact: 'haldianutgrid@wb.gov.in'
  },
  {
    id: 'H1',
    coordinates: [76.9928, 28.6572],
    corridor: 'Delhi – Chandigarh',
    highway: 'NH 44',
    distanceFromHighway: '2.2 km',
    siteSize: '2000 m²',
    amenities: 'EV zone, pit stop',
    substation: 'HVPNL Sonipat (~1.5 km)',
    renewables: 'NA',
    contact: 'hvpnl.sonipat@haryana.gov.in'
  },
  {
    id: 'H2',
    coordinates: [76.8005, 29.6839],
    corridor: 'Delhi – Chandigarh',
    highway: 'NH 44',
    distanceFromHighway: '2.5 km',
    siteSize: '2100 m²',
    amenities: 'Fuel, hotel, workshop',
    substation: 'HVPNL Karnal (~1.9 km)',
    renewables: 'NA',
    contact: 'hvpnl.karnal@haryana.gov.in'
  },
  {
    id: 'H3',
    coordinates: [76.6521, 30.3780],
    corridor: 'Delhi – Chandigarh',
    highway: 'NH 44',
    distanceFromHighway: '2.7 km',
    siteSize: '2300 m²',
    amenities: 'Truck bay, dhaba cluster',
    substation: 'PSPCL Ambala (~2.0 km)',
    renewables: 'NA',
    contact: 'pspcl.ambala@punjab.gov.in'
  },
  {
    id: 'H4',
    coordinates: [76.7794, 30.7333],
    corridor: 'Delhi – Chandigarh',
    highway: 'NH 44',
    distanceFromHighway: '2.4 km',
    siteSize: '2400 m²',
    amenities: 'Rest stop, tea shops',
    substation: 'PSPCL Chandigarh (~1.5 km)',
    renewables: 'Rooftop installations visible',
    contact: 'pspcl.chandigarh@punjab.gov.in'
  },
  {
    id: 'H5',
    coordinates: [76.8654, 30.5165],
    corridor: 'Delhi – Chandigarh',
    highway: 'NH 44',
    distanceFromHighway: '2.6 km',
    siteSize: '2200 m²',
    amenities: 'Halting facility, tire repair',
    substation: 'PSPCL Zirakpur (~1.7 km)',
    renewables: 'NA',
    contact: 'pspcl.zirakpur@punjab.gov.in'
  },
  {
    id: 'I1',
    coordinates: [86.4304, 23.7957],
    corridor: 'Dhanbad – Kolkata',
    highway: 'NH 18',
    distanceFromHighway: '2.2 km',
    siteSize: '2200 m²',
    amenities: 'Rest station, fuel, food',
    substation: 'JBVNL Dhanbad (~1.5 km)',
    renewables: 'BCCL rooftop solar',
    contact: 'jbvnl.dhanbad@jharkhand.gov.in'
  },
  {
    id: 'I2',
    coordinates: [86.9261, 23.2335],
    corridor: 'Dhanbad – Kolkata',
    highway: 'NH 18',
    distanceFromHighway: '2.6 km',
    siteSize: '2300 m²',
    amenities: 'Service hub, eateries',
    substation: 'JBVNL Bokaro (~2.0 km)',
    renewables: 'BCCL solar park nearby',
    contact: 'jbvnl.bokaro@jharkhand.gov.in'
  },
  {
    id: 'I3',
    coordinates: [87.4130, 23.0641],
    corridor: 'Dhanbad – Kolkata',
    highway: 'NH 18',
    distanceFromHighway: '2.7 km',
    siteSize: '2400 m²',
    amenities: 'Repair center, dhaba',
    substation: 'DVC Mejia (~2.1 km)',
    renewables: 'Floating solar visible',
    contact: 'dvc.mejia@india.gov.in'
  },
  {
    id: 'I4',
    coordinates: [88.0714, 22.8416],
    corridor: 'Dhanbad – Kolkata',
    highway: 'NH 18',
    distanceFromHighway: '2.5 km',
    siteSize: '2100 m²',
    amenities: 'City entry point, fuel station',
    substation: 'WBSEDCL Durgapur (~1.8 km)',
    renewables: 'Rooftop solar',
    contact: 'wbsedcl.durgapur@wb.gov.in'
  },
  {
    id: 'I5',
    coordinates: [88.3639, 22.5726],
    corridor: 'Dhanbad – Kolkata',
    highway: 'NH 18',
    distanceFromHighway: '2.3 km',
    siteSize: '2000 m²',
    amenities: 'Kolkata industrial gateway',
    substation: 'WBSEDCL Howrah (~1.5 km)',
    renewables: 'Urban rooftop PV cluster',
    contact: 'wbsedcl.howrah@wb.gov.in'
  },
  {
    id: 'J1',
    coordinates: [73.8567, 18.5204],
    corridor: 'Pune – Nashik',
    highway: 'NH 60',
    distanceFromHighway: '2.5 km',
    siteSize: '2200 m²',
    amenities: 'Fuel pump, parking, dhaba',
    substation: 'MSEDCL Pune East (~1.6 km)',
    renewables: 'Rooftop PV',
    contact: 'msedcl.pune@mah.gov.in'
  },
  {
    id: 'J2',
    coordinates: [73.9001, 18.9241],
    corridor: 'Pune – Nashik',
    highway: 'NH 60',
    distanceFromHighway: '2.4 km',
    siteSize: '2300 m²',
    amenities: 'Garage, fuel, cafe',
    substation: 'MSEDCL Chakan (~2.0 km)',
    renewables: 'NA',
    contact: 'msedcl.chakan@mah.gov.in'
  },
  {
    id: 'J3',
    coordinates: [73.9293, 19.5633],
    corridor: 'Pune – Nashik',
    highway: 'NH 60',
    distanceFromHighway: '2.6 km',
    siteSize: '2100 m²',
    amenities: 'Truck workshop, tea stalls',
    substation: 'MSEDCL Sinnar (~1.8 km)',
    renewables: 'NA',
    contact: 'msedcl.sinnar@mah.gov.in'
  },
  {
    id: 'J4',
    coordinates: [73.7898, 19.9975],
    corridor: 'Pune – Nashik',
    highway: 'NH 60',
    distanceFromHighway: '2.8 km',
    siteSize: '2400 m²',
    amenities: 'EV lounge, tire center',
    substation: 'MSEDCL Nashik South (~2.1 km)',
    renewables: 'Rooftop solar installed',
    contact: 'msedcl.nashik@mah.gov.in'
  },
  {
    id: 'J5',
    coordinates: [73.7743, 20.0124],
    corridor: 'Pune – Nashik',
    highway: 'NH 60',
    distanceFromHighway: '2.5 km',
    siteSize: '2200 m²',
    amenities: 'Rest zone, dhaba, auto repair',
    substation: 'MSEDCL Nashik Industrial (~1.9 km)',
    renewables: 'Rooftop PV active',
    contact: 'msedcl.nashikzone@mah.gov.in'
  },
 
    {
    "id": "K1",
    "coordinates": [77.3860, 28.5653],
    "corridor": "Delhi – Agra",
    "highway": "Yamuna Expressway",
    "distanceFromHighway": "2.3 km",
    "siteSize": "2200 m²",
    "amenities": "Large truck lay-by, fuel station, dhaba cluster",
    "substation": "UPPCL Jewar Substation (~2.1 km)",
    "renewables": "NA",
    "contact": "uppcl.jewar@up.gov.in"
  },
  {
    "id": "K2",
    "coordinates": [77.6324, 27.7742],
    "corridor": "Delhi – Agra",
    "highway": "Yamuna Expressway",
    "distanceFromHighway": "2.5 km",
    "siteSize": "2300 m²",
    "amenities": "Highway halt, café, EV pilot station, truck parking",
    "substation": "UPPCL Mathura Grid (~2.0 km)",
    "renewables": "NA",
    "contact": "uppcl.mathura@up.gov.in"
  },
  {
    "id": "K3",
    "coordinates": [78.0822, 27.2070],
    "corridor": "Delhi – Agra",
    "highway": "Yamuna Expressway",
    "distanceFromHighway": "2.7 km",
    "siteSize": "2400 m²",
    "amenities": "Rest area, fuel station, vehicle repair zone",
    "substation": "UPPCL Agra South (~2.4 km)",
    "renewables": "NA",
    "contact": "uppcl.agra@up.gov.in"
  },
  {
  id: 'P1',
  coordinates: [86.4050, 23.7800],
  corridor: 'Dhanbad – Ranchi – Jamshedpur',
  highway: 'NH 18',
  distanceFromHighway: '2.3 km',
  siteSize: '2000 m²',
  amenities: 'Petrol pump (~1 km), truck parking (~800 m), dhaba (~500 m)',
  substation: '132 kV JBVNL feeder; East Basuria Colliery Substation (~1.1 km)',
  renewables: 'Upcoming BCCL Dhanbad PV Park, railway rooftop solar nearby',
  contact: 'bccl.cmp@gov.in | +91-326-2230195'
},
{
  id: 'P2',
  coordinates: [85.3000, 23.3200],
  corridor: 'Dhanbad – Ranchi – Jamshedpur',
  highway: 'NH 20',
  distanceFromHighway: '2.0 km',
  siteSize: '1800 m²',
  amenities: 'Petrol pump (~700 m), dhabas (~1 km), hotel (~1.5 km)',
  substation: '20 MVA Tatisilwai Substation (~1.2 km)',
  renewables: 'Rooftop/canal-top solar zone on JREDA cluster',
  contact: 'jiada.rnc@gmail.com | +91-651-2460125'
},
{
  id: 'P3',
  coordinates: [86.1185, 22.8020],
  corridor: 'Dhanbad – Ranchi – Jamshedpur',
  highway: 'NH 33',
  distanceFromHighway: '2.8 km',
  siteSize: '2200 m²',
  amenities: 'Petrol pump (~600 m), dhaba (~1 km), workshops (~1 km), truck parking (~900 m)',
  substation: 'Adityapur-1 Substation (132/33 kV, ~1 km)',
  renewables: 'Tata rooftop solar & industrial PV cluster',
  contact: 'aiada1972@gmail.com | +91-657-2371693'
},


];

export default function EVMapDashboard() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [activeCorridor, setActiveCorridor] = useState(null);
  const [markerRefs, setMarkerRefs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80, 22],
      zoom: 4.3
    });
  }, []);

  useEffect(() => {
  const fetchAllRoutes = async () => {
    const fetchedRoutes = {};
    for (const c of corridorDefs) {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${c.src[0]},${c.src[1]};${c.dst[0]},${c.dst[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.routes?.[0]?.geometry) {
          fetchedRoutes[c.id] = json.routes[0].geometry;
        }
      } catch (err) {
        console.error(`Failed to fetch route ${c.id}:`, err);
      }
    }
    setRoutes(fetchedRoutes);  // ✅ Set only after all routes are fetched
  };

  fetchAllRoutes();
}, []);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !Object.keys(routes).length) return;

    corridorDefs.forEach(c => {
      const layerId = `route-${c.id}`;
      if (map.getSource(layerId)) return;

      map.addSource(layerId, {
        type: 'geojson',
        data: { type: 'Feature', geometry: routes[c.id] }
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: layerId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': c.color,
          'line-width': 4
        }
      });

      map.on('click', layerId, () => {
        setActiveCorridor(prev => (prev === c.id ? null : c.id));
      });
    });
  }, [routes]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRefs.forEach(m => m.remove());
    const newMarkers = [];

    let filtered = [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = siteData.filter(site =>
        (activeCorridor ? site.id.startsWith(activeCorridor) : true) &&
        Object.values(site).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(query)
        )
      );
    } else if (activeCorridor) {
      filtered = siteData.filter(site => site.id.startsWith(activeCorridor));
    } else {
      filtered = [];
    }

    const bounds = new mapboxgl.LngLatBounds();

    filtered.forEach(site => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${site.id} – ${site.corridor}</strong><br/>
         <b>Highway:</b> ${site.highway}<br/>
         <b>Distance from Highway:</b> ${site.distanceFromHighway}<br/>
         <b>Coordinates:</b> ${site.coordinates[1].toFixed(4)}, ${site.coordinates[0].toFixed(4)}<br/>
         <b>Site Size:</b> ${site.siteSize}<br/>
         <b>Amenities:</b> ${site.amenities}<br/>
         <b>Substation:</b> ${site.substation}<br/>
         <b>Renewables:</b> ${site.renewables}<br/>
         <b>Contact:</b> ${site.contact}`
      );

      const marker = new mapboxgl.Marker({ color: '#D91F1F' })
        .setLngLat(site.coordinates)
        .setPopup(popup)
        .addTo(map);

      newMarkers.push(marker);
      bounds.extend(site.coordinates);
    });

    setMarkerRefs(newMarkers);

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 100 });
    }
  }, [activeCorridor, searchQuery]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: '#f4f4f4',
        borderRight: '1px solid #ccc',
        padding: '12px',
        overflowY: 'auto'
      }}>
        <h3 style={{ textAlign: 'center' }}>EV Corridors</h3>
        {corridorDefs.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCorridor(prev => (prev === c.id ? null : c.id))}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '8px',
              padding: '8px 12px',
              background: activeCorridor === c.id ? c.color : '#fff',
              color: activeCorridor === c.id ? '#fff' : '#333',
              border: `1px solid ${c.color}`,
              borderRadius: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: activeCorridor === c.id ? 'bold' : 'normal'
            }}
          >
            {c.id} - {c.name}
          </button>
        ))}
      </div>

      {/* Right section: search + map */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px', background: '#fff', borderBottom: '1px solid #ccc' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search site by ID or keyword (e.g. A1, dhaba)"
            style={{
              width: '400px',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div ref={mapContainer} style={{ flex: 1 }} />
      </div>
    </div>
  );
}
