import * as AWS from 'aws-sdk';

// Set up AWS SDK configurations for source and destination regions
const sourceRegion = 'us-east-1';
const destinationRegion = 'us-east-2';

const sourceLambda = new AWS.Lambda({ region: sourceRegion });
const destinationLambda = new AWS.Lambda({ region: destinationRegion });

async function copyLambdaFunction(functionName: string) {
  try {
    // Get the Lambda function configuration from the source region
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

    // Get the function code from the source region
    const functionCode = await sourceLambda
      .getFunction({ FunctionName: functionName })
      .promise();

    if (!functionCode.Code || !functionCode.Code.Location) {
      throw new Error('Function code not found.');
    }

    // Download the function code
    const response = await fetch(functionCode.Code.Location);
    const codeBuffer = await response.arrayBuffer();

    // Create the Lambda function in the destination region
    const params: AWS.Lambda.CreateFunctionRequest = {
      Code: {
        ZipFile: Buffer.from(codeBuffer)
      },
      FunctionName: functionName,
      Handler: Handler,
      Role: Role,
      Runtime: Runtime,
      Description: Description || '', // Provide a default description if undefined
      Timeout: Timeout || 3, // Provide a default timeout if undefined
      MemorySize: MemorySize || 128, // Provide a default memory size if undefined
      Environment: Environment,
      Publish: true
    };

    await destinationLambda.createFunction(params).promise();
    console.log(
      `Successfully copied Lambda function "${functionName}" to region "${destinationRegion}"`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error copying Lambda function: ${error.message}`);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

// Main function to execute the copy process
async function main() {
  const functionName = 'place-holder-function-name';
  await copyLambdaFunction(functionName);
}

main();
