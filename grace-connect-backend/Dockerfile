# Use Node 20 LTS
FROM node:20

WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Explicitly install all dependencies including devDependencies
RUN npm install --include=dev

# Install TypeScript globally as a safety net
RUN npm install -g typescript ts-node

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN tsc

# Switch to production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the backend
CMD ["node", "dist/app.js"]