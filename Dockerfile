# Use the official Node.js 14.x image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Install dependencies required by Playwright and browsers
RUN apt-get update && apt-get install -y \
  curl \
  libnss3 \
  libnss3-dev \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libxss1 \
  libgtk-3-0 \
  libxtst6

# Install Playwright
RUN npx playwright install

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port on which the server will listen
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]