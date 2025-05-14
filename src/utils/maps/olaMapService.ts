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
  // Debug information
  console.log('Checking geolocation support...');
  console.log('Navigator geolocation:', !!navigator.geolocation);
  console.log('Protocol:', window.location.protocol);
  console.log('Hostname:', window.location.hostname);
  
  // Check permissions
  if (navigator.permissions) {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      console.log('Permission state:', permission.state);
    } catch (e) {
      console.log('Permission query failed:', e);
    }
  }

  if (!navigator.geolocation) {
    throw new Error(MAP_ERRORS.POSITION_UNAVAILABLE);
  }

  // Different geolocation options to try
  const geolocationOptions = [
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 30000
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000
    }
  ];

  // Try each option until one works
  for (const options of geolocationOptions) {
    try {
      console.log('Trying geolocation with options:', options);
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
      
      console.log('Success! Got position:', position.coords);
      
      // Get proper address using reverse geocoding
      const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: address
      };
    } catch (error) {
      console.log(`Failed with options:`, options, error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            throw new Error(MAP_ERRORS.PERMISSION_DENIED);
          case error.POSITION_UNAVAILABLE:
            console.log('Position unavailable, trying next option...');
            continue;
          case error.TIMEOUT:
            console.log('Timeout, trying next option...');
            continue;
        }
      }
    }
  }

  // If all methods fail, throw error (no fallback)
  throw new Error(MAP_ERRORS.POSITION_UNAVAILABLE);
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