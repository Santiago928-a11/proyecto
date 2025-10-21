# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.16

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 4200
EXPOSE 4200

# Command to run the application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

