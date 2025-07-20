import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, LayersControl, LayerGroup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet-iconmaterial'; // Import the plugin

// Default Leaflet icon fix (still needed for base markers if not using custom icons everywhere)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Move L.Icon.Default.mergeOptions to the top-level
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Location {
  id: number;
  bibsNumber: string;
  summary: string;
  latitude: number;
  longitude: number;
  status?: string; // Add status for dynamic icons
  result?: string;
}

interface MapProps {
  onMapClick?: (event: LeafletMouseEvent) => void;
  clickedPosition?: [number, number] | null;
  refreshKey?: number;
}

const MapEvents = ({ onMapClick }: { onMapClick?: (event: LeafletMouseEvent) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick?.(e);
    },
  });
  return null;
};

export default function Map({ onMapClick, clickedPosition, refreshKey }: MapProps) {
  const [firstAidGeoJSON, setFirstAidGeoJSON] = useState<any>(null);
  const [gateGeoJSON, setGateGeoJSON] = useState<any>(null);
  const [aidGeoJSON, setAidGeoJSON] = useState<any>(null);
  const [aedGeoJSON, setAedGeoJSON] = useState<any>(null);
  const [courseGeoJSON, setCourseGeoJSON] = useState<any>(null);

  // ここで宣言
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Fetch locations
    fetch('/api/locations')
      .then(res => res.json() as Promise<Location[]>)
      .then(data => setLocations(data));

    // Fetch GeoJSON data
    fetch('/api/geojson/firstAid').then(res => res.json()).then(setFirstAidGeoJSON);
    fetch('/api/geojson/gate').then(res => res.json()).then(setGateGeoJSON);
    fetch('/api/geojson/aid').then(res => res.json()).then(setAidGeoJSON);
    fetch('/api/geojson/aed').then(res => res.json()).then(setAedGeoJSON);
    fetch('/api/geojson/course').then(res => res.json()).then(setCourseGeoJSON);

  }, [refreshKey]);

  // Function to create Material Icon (memoized)
  const createMaterialIcon = useMemo(() => (iconName: string, iconColor: string, markerColor: string) => {
    // L.IconMaterial is provided by the leaflet-iconmaterial plugin
    return (L as any).IconMaterial.icon({
      icon: iconName,
      iconColor: iconColor,
      markerColor: markerColor,
      outlineColor: 'black', // Default outline
      outlineWidth: 1,
      iconSize: [31, 42],
      iconAnchor: [15.5, 38], // y値を38に微調整
      popupAnchor: [0, -38]   // ポップアップを真上に
    });
  }, []);

  // Define icons based on status (memoized)
  const statusIcons = useMemo(() => ({
    open: createMaterialIcon('directions_run', 'black', '#ffcccc'),
    move: createMaterialIcon('directions_run', 'black', '#fff4cc'),
    active: createMaterialIcon('directions_run', 'black', '#ccffcc'),
    closed: createMaterialIcon('directions_run', 'black', '#ccccff'),
  }), [createMaterialIcon]);

  // Define icons for GeoJSON layers (memoized)
  const medicalIcon = useMemo(() => createMaterialIcon('medical_services', 'red', 'rgba(255,255,255,1)'), [createMaterialIcon]);
  const timerOffIcon = useMemo(() => createMaterialIcon('timer_off', 'black', 'rgba(255,255,255,1)'), [createMaterialIcon]);
  const waterIcon = useMemo(() => createMaterialIcon('water_drop', 'blue', 'rgba(255,255,255,1)'), [createMaterialIcon]);
  const aedIcon = useMemo(() => createMaterialIcon('monitor_heart', 'red', 'rgba(255,255,255,1)'), [createMaterialIcon]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      let comment = '';
      if (feature.properties.comment) {
        comment = `<br/>${feature.properties.comment}`;
      }
      layer.bindPopup(`<b>${feature.properties.name}</b>${comment}`);
    }
  };

  const onEachColor = (feature: any) => {
    return {
      color: feature.properties._color,
      weight: feature.properties._weight,
      opacity: feature.properties._opacity
    };
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer center={[41.77583, 140.73667]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <MapEvents onMapClick={onMapClick} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map(location => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={statusIcons[location.status as keyof typeof statusIcons] || statusIcons.closed}
          >
            <Popup>
              <b>{location.bibsNumber}</b><br />{location.summary}<br />{location.result}
            </Popup>
          </Marker>
        ))}

        {clickedPosition && (
          <Marker position={clickedPosition}>
            <Popup>You clicked here</Popup>
          </Marker>
        )}

        <LayersControl position="topright" collapsed={false}>
          <LayersControl.Overlay name="救護所">
            <LayerGroup>
              {firstAidGeoJSON && (
                <GeoJSON
                  data={firstAidGeoJSON}
                  pointToLayer={(feature, latlng) => L.marker(latlng, { icon: medicalIcon })}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="関門">
            <LayerGroup>
              {gateGeoJSON && (
                <GeoJSON
                  data={gateGeoJSON}
                  pointToLayer={(feature, latlng) => L.marker(latlng, { icon: timerOffIcon })}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="エイド">
            <LayerGroup>
              {aidGeoJSON && (
                <GeoJSON
                  data={aidGeoJSON}
                  pointToLayer={(feature, latlng) => L.marker(latlng, { icon: waterIcon })}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="AED">
            <LayerGroup>
              {aedGeoJSON && (
                <GeoJSON
                  data={aedGeoJSON}
                  pointToLayer={(feature, latlng) => L.marker(latlng, { icon: aedIcon })}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="コース">
            <LayerGroup>
              {courseGeoJSON && (
                <GeoJSON
                  data={courseGeoJSON}
                  style={onEachColor}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto',
        width: '250px'
      }}>
        <h2>Locations</h2>
        <ul>
          {locations.map(location => (
            <li key={location.id}>
              <strong>{location.bibsNumber}</strong> ({location.status}) {location.result && ` - ${location.result}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}