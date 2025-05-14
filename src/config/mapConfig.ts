
export const MAP_CONFIG = {
  defaultZoom: 15,
  defaultCenter: {
    // Default to Bengaluru coordinates
    latitude: 12.9716,
    longitude: 77.5946,
  },
  markerOptions: {
    draggable: true,
  },
  mapOptions: {
    // Remove the problematic attributionControl or set it correctly
    // attributionControl can be false or an object with options
    doubleClickZoom: true,
    dragPan: true,
    dragRotate: false,
    keyboard: true,
    scrollZoom: true,
    touchZoomRotate: true,
  },
};

export const MAP_ERRORS = {
  PERMISSION_DENIED: 'Location permission denied. Please enable location services.',
  POSITION_UNAVAILABLE: 'Location information is unavailable.',
  TIMEOUT: 'Location request timed out.',
  UNKNOWN_ERROR: 'An unknown error occurred while getting location.',
  MAP_INIT_ERROR: 'Failed to initialize map.',
  GEOCODING_ERROR: 'Failed to get address for location.',
};