import { envConfig } from "../../config/env.config";

export const buildCloudinaryUrl = (publicId: string): string => {
  return `${envConfig.cloudinaryBaseUrl}/${publicId}`;
};
