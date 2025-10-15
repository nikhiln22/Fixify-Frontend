export const envConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  cloudinaryBaseUrl: import.meta.env.VITE_CLOUDINARY_BASE_URL || "",
  olaMaps: {
    apiKey: import.meta.env.VITE_OLA_MAPS_API_KEY || "",
    reverseGeocodeUrl:
      import.meta.env.VITE_OLA_REVERSE_GEOCODE_URL ||
      "https://api.olamaps.io/places/v1/reverse-geocode",
  },
};

console.log("apiUrl:", envConfig.apiUrl);
