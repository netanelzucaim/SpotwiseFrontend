import { FC } from "react";
import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../../styles/MapPage.css';
import { MAPTILER_API_KEY } from '../../config';


const MapPage: FC = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const rishonLezion = { lng: 34.792501, lat: 31.973001 };
  const zoom = 14;
  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [rishonLezion.lng, rishonLezion.lat],
      zoom: zoom
    });

    new maptilersdk.Marker({color: "#FF0000"})
      .setLngLat([34.792501,31.973001])
      .addTo(map.current);

  }, [rishonLezion.lng, rishonLezion.lat, zoom]);

  return (
    <div className="map-page-container">
      <div className="info-panel">
        <h2>Info Panel</h2>
        <p>This area can contain details about the map, location, etc.</p>
      </div>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
}

export default MapPage;