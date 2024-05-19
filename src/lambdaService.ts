import * as AWS from 'aws-sdk';
import { config } from './config';
import { downloadFunctionCode } from './utils';

const sourceLambda = new AWS.Lambda({ region: config.sourceRegion });
const destinationLambda = new AWS.Lambda({ region: config.destinationRegion });

export async function copyLambdaFunction(functionName: string) {
  try {
    const functionConfig = await sourceLambda
      .getFunction({ FunctionName: functionName })
      .promise();

    if (!functionConfig.Configuration) {
      throw new Error('Function configuration not found.');
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
      throw new Error('Role, Handler, and Runtime must be defined.');
    }

    const functionCode = await sourceLambda
      .getFunction({ FunctionName: functionName })
      .promise();

    if (!functionCode.Code || !functionCode.Code.Location) {
      throw new Error('Function code not found.');
    }

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
    console.log(
      `Successfully copied Lambda function "${functionName}" to region "${config.destinationRegion}"`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error copying Lambda function: ${error.message}`);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}
