const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv] || "";
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const envConfig = {
  apiUrl: getEnvVariable("VITE_API_URL"),
  cloudinaryBaseUrl: getEnvVariable("VITE_CLOUDINARY_BASE_URL"),
};
