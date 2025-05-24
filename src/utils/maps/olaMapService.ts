import { OlaMaps } from 'olamaps-web-sdk';
import { 
  MapLocation, 
  MapConfig, 
  MapInstance, 
  ReverseGeocodeResult, 
  MapCallbacks 
} from '../../types/map.types';
import { MAP_CONFIG, MAP_ERRORS } from '../../config/mapConfig';

// Store for map instances
const mapInstances = new Map<string, MapInstance>();

// Simple flag to prevent multiple requests at once
let isGettingLocation = false;

// Reverse geocoding function
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
    const response = await fetch(
      `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    return data.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Get current location using browser geolocation
export const getCurrentLocation = async (): Promise<MapLocation> => {
  // Prevent multiple simultaneous requests
  if (isGettingLocation) {
    throw new Error('Location request already in progress. Please wait.');
  }
  
  isGettingLocation = true;

  try {
    console.log('Getting current location...');
    console.log('Navigator geolocation:', !!navigator.geolocation);

    if (!navigator.geolocation) {
      throw new Error(MAP_ERRORS.POSITION_UNAVAILABLE);
    }

    // Get location with a single attempt
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Got position:', pos.coords);
          resolve(pos);
        },
        (error) => {
          console.log('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 300000 // Use 5-minute-old cached result if available
        }
      );
    });

    // Get address
    const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      address: address
    };

  } catch (error) {
    console.error('Location error:', error);
    
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          throw new Error(MAP_ERRORS.PERMISSION_DENIED);
        case error.POSITION_UNAVAILABLE:
          throw new Error(MAP_ERRORS.POSITION_UNAVAILABLE);
        case error.TIMEOUT:
          throw new Error(MAP_ERRORS.TIMEOUT);
      }
    }
    throw new Error(MAP_ERRORS.UNKNOWN_ERROR);
  } finally {
    // Always reset the flag
    isGettingLocation = false;
  }
};

// Initialize map with container and options
export const initializeMap = (
  container: HTMLElement,
  location: MapLocation,
  callbacks?: MapCallbacks,
  config?: Partial<MapConfig>
): MapInstance => {
  if (!container) {
    throw new Error('Container element is required');
  }

  // Ensure container has an ID
  if (!container.id) {
    container.id = `ola-map-${Date.now()}`;
  }

  try {
    const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
    console.log('OlaMaps initialization starting...');
    console.log('Container ID:', container.id);
    console.log('API Key present:', !!apiKey);

    // Create OlaMaps instance with API key
    const olaMaps = new OlaMaps({
      apiKey: apiKey || '',
    });
    console.log('OlaMaps instance created');

    // Initialize the map with proper options
    const mapCenter: [number, number] = [location.longitude, location.latitude];
    console.log('Map center:', mapCenter);
    
    const map = olaMaps.init({
      container: container.id,
      center: mapCenter,
      zoom: config?.defaultZoom || MAP_CONFIG.defaultZoom,
    });
    console.log('Map initialized successfully');

    // Add navigation controls
    try {
      olaMaps.addNavigationControls();
      console.log('Navigation controls added');
    } catch (error) {
      console.error('Error adding navigation controls:', error);
    }
    
    // Add marker with proper drag handling
    const marker = olaMaps.addMarker({
      color: '#FF0000',
      draggable: true,
    })
    .setLngLat(mapCenter)
    .addTo(map);
    
    console.log('Marker added successfully');

    // Handle marker drag
    marker.on('dragend', async () => {
      const position = marker.getLngLat();
      console.log('Marker dragged to:', position);
      
      if (position && callbacks?.onMarkerDragEnd) {
        // Get address for new position
        const address = await reverseGeocode(position.lat, position.lng);
        
        const newLocation: MapLocation = { 
          latitude: position.lat, 
          longitude: position.lng,
          address: address
        };
        
        console.log('Calling onMarkerDragEnd with:', newLocation);
        callbacks.onMarkerDragEnd(newLocation);
      }
    });

    // Create map instance object
    const mapInstance: MapInstance = {
      map,
      marker,
      remove: () => {
        if (map && typeof map.remove === 'function') {
          map.remove();
        }
        if (container.id) {
          mapInstances.delete(container.id);
        }
      },
      updateLocation: (newLocation: MapLocation) => {
        const newCenter: [number, number] = [newLocation.longitude, newLocation.latitude];
        map.setCenter(newCenter);
        marker.setLngLat(newCenter);
      },
    };

    // Store instance
    mapInstances.set(container.id, mapInstance);
    
    console.log('Map initialization complete');
    return mapInstance;
  } catch (error) {
    console.error('Error initializing map:', error);
    throw new Error(MAP_ERRORS.MAP_INIT_ERROR);
  }
};

// Get a stored map instance by ID
export const getMapInstance = (id: string): MapInstance | undefined => {
  return mapInstances.get(id);
};

// Remove all map instances (cleanup)
export const removeAllMaps = (): void => {
  mapInstances.forEach(instance => {
    instance.remove();
  });
  mapInstances.clear();
};

// Check if OlaMaps is properly loaded
export const isMapServiceAvailable = (): boolean => {
  const available = typeof OlaMaps !== 'undefined';
  console.log('OlaMaps available:', available);
  return available;
};