FROM node:12.2.0

# Set enviroment variables
ENV INTELLI_USERNAME ${INTELLI_USERNAME}
ENV INTELLI_PASSWORD ${INTELLI_PASSWORD}
ENV INTELLI_ENDPOINT ${INTELLI_ENDPOINT}
ENV PORT ${PORT}

# Set work directory to somewhere safe
WORKDIR /usr/src/elfdoors

# Copy the package.json/package.lock.json files to the workdir
COPY package*.json ./

# Install the npm deps
RUN npm ci

# Bundle app source
COPY . .

# Build the Angular frontend
RUN node_modules/@angular/cli/bin/ng build

# Expose the app port
EXPOSE ${PORT}

# Start the server
CMD [ "node", "express.js" ]
