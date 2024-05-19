import * as AWS from 'aws-sdk';
import { config } from './config';
import { downloadFunctionCode, sanitizeUrl } from './utils';
import logger from './logger';
import { LambdaSyncError } from './errors';

const sourceLambda = new AWS.Lambda({ region: config.sourceRegion });
const destinationLambda = new AWS.Lambda({ region: config.destinationRegion });

export async function copyLambdaFunction(functionName: string) {
  try {
    logger.info(
      `Starting to copy Lambda function "${functionName}" from "${config.sourceRegion}" to "${config.destinationRegion}"`
    );

    const functionConfig = await sourceLambda
      .getFunction({ FunctionName: functionName })
      .promise();

    if (!functionConfig.Configuration) {
      throw new LambdaSyncError('Function configuration not found.');
    }

    const {
      Role,
      Handler,
      Runtime,
      Timeout,
      MemorySize,
      Environment,
      Description
    } = functionConfig.Configuration;

    if (!Role || !Handler || !Runtime) {
      throw new LambdaSyncError('Role, Handler, and Runtime must be defined.');
    }

    const functionCode = await sourceLambda
      .getFunction({ FunctionName: functionName })
      .promise();

    if (!functionCode.Code || !functionCode.Code.Location) {
      throw new LambdaSyncError('Function code not found.');
    }

    const sanitizedUrl = sanitizeUrl(functionCode.Code.Location);
    logger.info(`Downloading function code from ${sanitizedUrl}`);

    const codeBuffer = await downloadFunctionCode(functionCode.Code.Location);

    const params: AWS.Lambda.CreateFunctionRequest = {
      Code: { ZipFile: Buffer.from(codeBuffer) },
      FunctionName: functionName,
      Handler,
      Role,
      Runtime,
      Description: Description || '',
      Timeout: Timeout || 3,
      MemorySize: MemorySize || 128,
      Environment,
      Publish: true
    };

    await destinationLambda.createFunction(params).promise();
    logger.info(
      `Successfully copied Lambda function "${functionName}" to region "${config.destinationRegion}"`
    );
  } catch (error) {
    if (error instanceof LambdaSyncError) {
      logger.error(`LambdaSyncError: ${error.message}`);
    } else if (error instanceof Error) {
      logger.error(`Unexpected error: ${error.message}`);
    } else {
      logger.error('An unknown error occurred.');
    }
    logger.error('Failed to copy Lambda function');
    throw error;
  }
}
