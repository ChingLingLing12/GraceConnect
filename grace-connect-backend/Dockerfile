# Stage 1: build
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install --include=dev

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: production
FROM node:20 AS prod

WORKDIR /app

# Copy only runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 5000

# Start backend
CMD ["node", "dist/app.js"]