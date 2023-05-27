# Use an official Node.js runtime as a parent image
FROM node:14-alpine AS builder

# Install PNPM
RUN npm install -g pnpm

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files to the container
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN pnpm run build

# Use a lightweight Node.js runtime as a parent image
FROM node:14-alpine

# Install PNPM
RUN npm install -g pnpm

# Set the working directory to /app
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app/dist/apps/myapp .

# Expose port 4200 for the container
EXPOSE 4200

# Define the command that runs when the container starts
CMD ["pnpm", "start"]

# Tag the image with the version number
# For example, "mycompany/myimage:1.0.0"
LABEL version="1.0.0"