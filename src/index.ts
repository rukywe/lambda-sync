import { config } from './config';
import { copyLambdaFunction } from './lambdaService';
import logger from './logger';

async function main() {
  const { functionName } = config;
  if (!functionName) {
    logger.error('Function name is not defined in the environment variables.');
    return;
  }
  try {
    await copyLambdaFunction(functionName);
  } catch (error) {
    logger.error('Failed to copy Lambda function');
  }
}

main();
