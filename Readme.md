# LambdaSync

LambdaSync is a tool to copy AWS Lambda functions from one region to another using Node.js and TypeScript. It simplifies the process of replicating Lambda functions across different AWS regions for purposes such as disaster recovery, latency optimization, and compliance.

## Features

- Copy AWS Lambda functions from one region to another
- Maintain function configuration, including handler, role, runtime, environment variables, and more
- Simple and configurable setup

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

Ensure your AWS credentials are configured properly. You can do this by setting up the ~/.aws/credentials file or by using environment variables.

## Usage

1. Open index.ts and update the sourceRegion, destinationRegion, and functionName variables with your desired values.

2. Run the project:

   ```bash
   npm start
   ```
