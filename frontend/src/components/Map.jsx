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

const MapDisplay = ({ sites = [], center = [50.8333, 12.9167], zoom = 13, className = "h-[400px] w-full rounded-3xl shadow-2xl border-4 border-emerald-100" }) => {
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 shadow-lg border border-emerald-100">
                <h3 className="font-extrabold text-lg mb-1 text-emerald-700">{site.name}</h3>
                <p className="text-xs font-semibold text-violet-600 mb-2 uppercase tracking-wider">{site.category}</p>
                <Link
                  to={`/sites/${site._id}`}
                  className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 text-white font-medium shadow hover:from-emerald-500 hover:to-violet-600 transition-all text-xs"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapDisplay;