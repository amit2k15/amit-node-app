# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY src .

# Expose port
EXPOSE 7000

# Start command
CMD ["npm", "start"]