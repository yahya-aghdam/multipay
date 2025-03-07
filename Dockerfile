# Development Stage
FROM node:22-alpine AS development 
# Use the Node.js 22 Alpine image for a lightweight and efficient base
# Label this stage as "development"

WORKDIR /usr/src/app/multipay_dev 
# Set the working directory inside the container for the development build

COPY package*.json . 
# Copy only the package.json and package-lock.json files to leverage Docker layer caching

RUN npm install 
# Install dependencies for development, including devDependencies

COPY . . 
# Copy the entire project into the container

RUN npm run build 
# Build the application (e.g., transpile TypeScript to JavaScript or generate a production build)

# Production Stage
FROM node:22-alpine AS production 
# Use the same Node.js 22 Alpine image for consistency in production

WORKDIR /usr/src/app/multipay 
# Set a new working directory for the production application

COPY package*.json . 
# Copy the package.json and package-lock.json for the production stage

RUN npm ci 
# Install only production dependencies (ignores devDependencies)

COPY --from=development /usr/src/app/multipay_dev/dist ./dist 
# Copy the built files (`dist` folder) from the development stage into the production stage

CMD ["node","dist/index.js"] 
# Define the default command to start the application
