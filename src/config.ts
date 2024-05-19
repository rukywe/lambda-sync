import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  sourceRegion: process.env.SOURCE_REGION,
  destinationRegion: process.env.DESTINATION_REGION,
  functionName: process.env.FUNCTION_NAME || ''
};
