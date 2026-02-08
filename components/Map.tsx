"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e);
        },
    });
    return null;
}

interface Spot {
    id: string | number;
    name: string;
    position: [number, number];
    description: string;
    type?: string;
    difficulty?: string;
    rating?: number;
    clipCount?: number;
}

interface MapComponentProps {
    onMapClick?: (latlng: [number, number]) => void;
    spots?: Spot[];
    mapCenter?: [number, number] | null;
}

function FlyToLocation({ center }: { center: [number, number] | null }) {
    const map = useMapEvents({});

    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { duration: 2 });
        }
    }, [center, map]);

    return null;
}

export default function MapComponent({ onMapClick, spots = [], mapCenter }: MapComponentProps) {
    useEffect(() => {
        window.dispatchEvent(new Event("resize"));
    }, []);

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg outline-none"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapCenter && <FlyToLocation center={mapCenter} />}
            {spots.map((spot) => (
                <Marker key={spot.id} position={spot.position} icon={customIcon}>
                    <Popup>
                        <div className="p-1 min-w-[180px]">
                            <h3 className="font-bold text-sm mb-1">{spot.name}</h3>
                            <p className="text-xs text-slate-600 mb-2">{spot.description}</p>
                            <div className="flex items-center gap-2 text-xs mb-2">
                                {spot.type && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px]">{spot.type}</span>
                                )}
                                {spot.difficulty && (
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                        spot.difficulty === 'Pro' || spot.difficulty === 'Legendary'
                                            ? 'bg-red-100 text-red-800'
                                            : spot.difficulty === 'Intermediate'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>{spot.difficulty}</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{spot.rating ? `${spot.rating.toFixed(1)} stars` : 'Not rated'}</span>
                                <span>{spot.clipCount ?? 0} clips</span>
                            </div>
                            <a
                                href={`/spot/${spot.id}`}
                                className="block mt-2 text-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1.5 transition-colors"
                            >
                                View Details
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {onMapClick && <MapEvents onMapClick={(e) => onMapClick([e.latlng.lat, e.latlng.lng])} />}
        </MapContainer>
    );
}
