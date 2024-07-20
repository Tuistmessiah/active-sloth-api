# Use the official Node.js image.
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy application files to the container image.
COPY . .

# Expose the port on which the app will run.
EXPOSE 3002

# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]
