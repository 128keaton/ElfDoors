# Elfdoors
**Copyright 2019 Keaton Burleson**

## Usage
### NodeJS
1. Setup

   Create a `.env` file in the project root. Use the template below to create your environment.
   ```
   # Intelli-M configuration
   INTELLI_ENDPOINT='http://69.69.69.69:420'
   INTELLI_USERNAME='admin'
   INTELLI_PASSWORD='admin'

   # Port to run the server on
   PORT=3000
   ```

2. Build

   Build the Angular frontend to be served by the ExpressJS server.
   ```bash
   $ npm run build:frontend
   ```

3. Run

   Start the ExpressJS server.
   ```bash
   $ npm run start
   ```

### docker-compose
1. Setup

   Create a `.env` file in the project root. Use the template below to create your environment.
   ```
   # Intelli-M configuration
   INTELLI_ENDPOINT='http://69.69.69.69:420'
   INTELLI_USERNAME='admin'
   INTELLI_PASSWORD='admin'

   # Port to run the server on
   PORT=3000
   ```

2. Build

   Build the Docker image to be served.
   ```bash
   $ docker-compose build
   ```

3. Run

   Start the Docker container.
   ```bash
   $ docker-compose up -d
   ```

### Heroku
   *Work in progress*

