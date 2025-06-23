# Use official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Cloud Run expects the app to listen on port 8080
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
