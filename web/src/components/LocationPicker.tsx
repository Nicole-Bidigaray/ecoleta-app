import { useEffect, useState } from 'react';
import { Icon } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import markerUrl from 'leaflet/dist/images/marker-icon.png';
import markerRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import type { Coordinates } from '../types';

const markerIcon = new Icon({
  iconUrl: markerUrl,
  iconRetinaUrl: markerRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});
const initialPosition: Coordinates = [0, 0];

interface Props {
  position: Coordinates;
  onChange: (position: Coordinates) => void;
}

function MapBehavior({ onChange, onLocationError }: Pick<Props, 'onChange'> & {
  onLocationError: (message: string) => void;
}) {
  const map = useMapEvents({
    click: (event) => onChange([event.latlng.lat, event.latlng.lng]),
    keydown: (event) => {
      if (event.originalEvent.key === 'Enter' && event.originalEvent.target === map.getContainer()) {
        event.originalEvent.preventDefault();
        const center = map.getCenter();
        onChange([center.lat, center.lng]);
      }
    },
  });

  useEffect(() => {
    let active = true;
    const message = 'Não foi possível obter sua localização. Selecione o endereço no mapa.';
    if (!navigator.geolocation) {
      onLocationError(message);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (active) map.setView([coords.latitude, coords.longitude], 15);
      },
      () => { if (active) onLocationError(message); },
      { timeout: 10_000, maximumAge: 60_000 },
    );
    return () => { active = false; };
  }, [map, onLocationError]);

  return null;
}

function AccessibleMap() {
  const map = useMap();
  useEffect(() => {
    map.getContainer().setAttribute('aria-label', 'Mapa: selecione o endereço do ponto de coleta');
    map.getContainer().setAttribute('aria-describedby', 'map-instructions');
  }, [map]);
  return null;
}

export default function LocationPicker({ position, onChange }: Props) {
  const [locationError, setLocationError] = useState('');
  return (
    <>
      <p id="map-instructions" className="visually-hidden">
        Clique para selecionar o endereço. Pelo teclado, use as setas para mover o mapa e Enter para selecionar o centro.
      </p>
      {locationError && <p className="feedback" role="status">{locationError}</p>}
      <MapContainer center={initialPosition} zoom={15}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon} alt="Local do ponto de coleta" />
        <MapBehavior onChange={onChange} onLocationError={setLocationError} />
        <AccessibleMap />
      </MapContainer>
    </>
  );
}
