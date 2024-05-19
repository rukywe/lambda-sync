import logger from './logger';
import { config } from './config';

export async function downloadFunctionCode(url: string): Promise<ArrayBuffer> {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download function code from ${url}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    throw error;
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const sanitizedUrl = new URL(url);
    sanitizedUrl.search = '';
    return sanitizedUrl.toString();
  } catch {
    return url;
  }
}

export function validateConfig() {
  const missingConfigs = [];
  if (!config.sourceRegion) {
    missingConfigs.push('SOURCE_REGION');
  }
  if (!config.destinationRegion) {
    missingConfigs.push('DESTINATION_REGION');
  }
  if (!config.functionName) {
    missingConfigs.push('FUNCTION_NAME');
  }
  if (missingConfigs.length > 0) {
    const errorMessage = `The following environment variables are missing: ${missingConfigs.join(
      ', '
    )}. Please set them in the .env file.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
