import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapDisplay = ({ sites = [], center = [50.8333, 12.9167], zoom = 13, className = "h-[400px] w-full" }) => {
  if (!sites || sites.length === 0) {
    return (
      <MapContainer center={center} zoom={zoom} className={className}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );
  }

  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {sites.map((site) =>
        site.latitude && site.longitude ? (
          <Marker key={site._id} position={[site.latitude, site.longitude]}>
            <Popup>
              <h3 className="font-semibold text-lg mb-1">{site.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{site.category}</p>
              <Link 
                to={`/sites/${site._id}`} 
                className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-medium"
              >
                View Details
              </Link>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapDisplay; 