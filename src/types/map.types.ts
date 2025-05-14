

import { Map as MapLibreMap } from 'maplibre-gl';
import { Marker } from 'maplibre-gl';

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface MapConfig {
  apiKey: string;
  defaultZoom?: number;
  zoomControl?: boolean;
  draggableMarker?: boolean;
}

export interface MapInstance {
  map: MapLibreMap;
  marker: Marker;
  remove: () => void;
  updateLocation: (location: MapLocation) => void;
}

export interface ReverseGeocodeResult {
  address: string;
  formattedAddress?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface MapCallbacks {
  onLocationChange?: (location: MapLocation) => void;
  onMarkerDragEnd?: (location: MapLocation) => void;
  onError?: (error: Error) => void;
}