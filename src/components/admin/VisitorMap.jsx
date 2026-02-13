import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export default function VisitorMap({ visitors = [] }) {
    // Filter visitors with valid lat/lng
    const locations = visitors.filter(v => v.lat && v.lng);
    const defaultCenter = [20, 0]; // Lat, Lng

    return (
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc, i) => (
                    <Marker key={i} position={[loc.lat, loc.lng]}>
                        <Popup>
                            <div className="text-center">
                                <span className="text-lg block mb-1">
                                    {loc.country === 'Unknown' ? '🌍' :
                                        loc.country?.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))}
                                </span>
                                <span className="font-bold text-gray-800">{loc.city || 'Desconocido'}</span>
                                <br />
                                <span className="text-xs text-gray-500">{loc.country}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 z-[1000] pointer-events-none">
                {locations.length} Ubicaciones
            </div>
        </div>
    );
}
