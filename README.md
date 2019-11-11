![](https://images.128keaton.com/elfdoors.png)
# Elfdoors
**Copyright 2019 Keaton Burleson**

## Usage
### node
1. Setup

   Create a `.env` file in the project root. Use the template below to create your environment.
   ```
   # Intelli-M configuration
   INTELLI_ENDPOINT='http://69.69.69.69:420'
   INTELLI_USERNAME='admin'
   INTELLI_PASSWORD='admin'
   
   # Defaults to 'ElfDoors'
   TITLE='Client1'

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

   # Defaults to 'ElfDoors'
   TITLE='Client1'
   
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
1. Setup

   Set your Heroku configuration like you would your environment variables.
   ```bash
   $ heroku config:set INTELLI_ENDPOINT=http://69.69.69.69:420
   $ heroku config:set INTELLI_USERNAME=admin
   $ heroku config:set INTELLI_PASSWORD=admin
   $ heroku config:set TITLE=ElfDoors
   ```

2. Create

   Create a Heroku app from the CLI.
   ```bash
   $ heroku apps:create elfdoors-instance-001
   $ heroku stack:set container
   ```
   
3. Deploy

   Deploy the Heroku app
   ```bash
   $ git push heroku master
   ```
