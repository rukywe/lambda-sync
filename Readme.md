# LambdaSync

LambdaSync is a tool to copy AWS Lambda functions from one region to another using Node.js and TypeScript. It simplifies the process of replicating Lambda functions across different AWS regions for purposes such as disaster recovery, latency optimization, and compliance.

## Features

- Copy AWS Lambda functions from one region to another
- Maintain function configuration, including handler, role, runtime, environment variables, and more
- Simple and configurable setup
- Configuration validation to ensure necessary environment variables are set

## Prerequisites

- Node.js and npm installed
- AWS CLI configured with appropriate credentials and permissions
- TypeScript installed globally (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rukywe/lambda-sync.git
   cd lambda-sync
   ```

2. Install the dependencies:

   ```bash
    npm install
   ```

## Configuration

Set up your AWS credentials. You can do this using environment variables or the AWS CLI configuration.

1. Using Environment Variables:

   ```bash
   export AWS_ACCESS_KEY_ID=your-access-key-id
   export AWS_SECRET_ACCESS_KEY=your-secret-access-key
   export AWS_SESSION_TOKEN=your-session-token (if needed)
   ```

2. Using AWS CLI Configuration:

   ```bash
    aws configure

   ```

   This command will prompt you to enter your AWS Access Key ID, Secret Access Key, region, and output format.

3. Create a .env file based on the provided .env.example file and update it with your configuration:

   ```bash
    cp .env.example .env

   ```

   .env.example:

   ```bash
    SOURCE_REGION=us-west-2
    DESTINATION_REGION=us-east-1
    FUNCTION_NAME=your-lambda-function-name

   ```

## Usage

1. Update the .env file with your Lambda function details:

   ```bash
    SOURCE_REGION=us-west-2
    DESTINATION_REGION=us-east-1
    FUNCTION_NAME=my-lambda-function

   ```

2. Run the project:

   ```bash
    npm start
   ```

## Configuration Validation

LambdaSync validates that all necessary environment variables are set before starting the process. If any variables are missing, the tool will log an error and provide usage instructions.

Example of an error log when a configuration variable is missing:

```bash
2024-05-19T17:31:59.380Z [error]: The following environment variables are missing: FUNCTION_NAME. Please set them in the .env file.
2024-05-19T17:31:59.381Z [error]: Failed to copy Lambda function
2024-05-19T17:31:59.381Z [error]: The following environment variables are missing: FUNCTION_NAME. Please set them in the .env file.
Usage Instructions:
    1. Set the following environment variables in the .env file:
       - SOURCE_REGION
       - DESTINATION_REGION
       - FUNCTION_NAME
    2. Run the project with: npm start

```
