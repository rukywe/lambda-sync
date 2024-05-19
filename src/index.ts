import { config } from './config';
import { copyLambdaFunction } from './lambdaService';

async function main() {
  const { functionName } = config;
  if (!functionName) {
    console.error('Function name is not defined in the environment variables.');
    return;
  }
  await copyLambdaFunction(functionName);
}

main();
