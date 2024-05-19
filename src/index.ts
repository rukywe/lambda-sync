import { config } from './config';
import { copyLambdaFunction } from './lambdaService';
import { validateConfig } from './utils';

import logger from './logger';

async function main() {
  try {
    validateConfig();
    await copyLambdaFunction(config.functionName);
  } catch (error) {
    logger.error('Failed to copy Lambda function');
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(`Usage Instructions:
        1. Set the following environment variables in the .env file:
           - SOURCE_REGION
           - DESTINATION_REGION
           - FUNCTION_NAME
        2. Run the project with: npm start`);
    }
  }
}

main();
