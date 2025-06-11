import { useState, useRef, useEffect, useCallback } from "react";
import * as olaMapService from "../utils/maps/olaMapService";
import { MapLocation, MapInstance, MapCallbacks } from "../types/map.types";
import { showToast } from "../utils/toast";

interface UseOlaMapProps {
  onLocationChange?: (location: MapLocation) => void;
  defaultLocation?: MapLocation;
}

export const useOlaMap = ({
  onLocationChange,
  defaultLocation,
}: UseOlaMapProps = {}) => {
  const [location, setLocation] = useState<MapLocation | null>(
    defaultLocation || null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Map state:", {
      hasLocation: !!location,
      hasContainer: !!mapContainerRef.current,
      isMapReady: !!mapInstance,
      location: location,
    });
  }, [location, mapInstance]);

  const initializeMap = useCallback(
    (mapLocation: MapLocation) => {
      if (!mapContainerRef.current) {
        console.error("Map container ref is null");
        return;
      }

      try {
        const callbacks: MapCallbacks = {
          onMarkerDragEnd: (newLocation: MapLocation) => {
            console.log("Marker drag end callback fired:", newLocation);
            setLocation(newLocation);
            onLocationChange?.(newLocation);
          },
          onError: (error: Error) => {
            console.error("Map error callback:", error);
            showToast({
              message: "Map error: " + error.message,
              type: "error",
            });
          },
        };

        console.log("Calling olaMapService.initializeMap...");
        const instance = olaMapService.initializeMap(
          mapContainerRef.current,
          mapLocation,
          callbacks,
          { draggableMarker: true },
        );

        console.log("Map instance created successfully:", instance);
        setMapInstance(instance);
      } catch (error) {
        console.error("Map initialization failed:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        showToast({
          message:
            "Failed to initialize map: " +
            (error instanceof Error ? error.message : "Unknown error"),
          type: "error",
        });
      }
    },
    [onLocationChange],
  );

  useEffect(() => {
    if (location && mapContainerRef.current && !mapInstance) {
      console.log("Location and container ready, initializing map...");
      const timer = setTimeout(() => {
        initializeMap(location);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location, mapInstance, initializeMap]);

  const getCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError("");

    try {
      console.log("Getting current location...");
      const currentLocation = await olaMapService.getCurrentLocation();
      console.log("Location obtained:", currentLocation);
      setLocation(currentLocation);

      onLocationChange?.(currentLocation);

      showToast({
        message: "Location captured successfully!",
        type: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get location";
      console.error("Location error:", error);
      setLocationError(errorMessage);
      showToast({
        message:
          errorMessage +
          ". Please select a city manually or check your browser settings.",
        type: "error",
      });
    } finally {
      setIsLoadingLocation(false);
    }
  }, [onLocationChange]);

  const setManualLocation = useCallback(
    (newLocation: MapLocation) => {
      setLocation(newLocation);
      if (mapInstance) {
        mapInstance.updateLocation(newLocation);
      } else if (mapContainerRef.current) {
        setTimeout(() => {
          initializeMap(newLocation);
        }, 100);
      }
      onLocationChange?.(newLocation);
    },
    [mapInstance, onLocationChange, initializeMap],
  );

  const updateLocation = useCallback(
    (newLocation: MapLocation) => {
      setLocation(newLocation);
      if (mapInstance) {
        mapInstance.updateLocation(newLocation);
      }
      onLocationChange?.(newLocation);
    },
    [mapInstance, onLocationChange],
  );

  const isMapAvailable = olaMapService.isMapServiceAvailable();

  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapInstance]);

  return {
    location,
    isLoadingLocation,
    locationError,
    mapContainerRef,
    getCurrentLocation,
    updateLocation,
    setManualLocation,
    isMapReady: !!mapInstance,
    isMapAvailable,
  };
};
