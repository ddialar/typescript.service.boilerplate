FROM node:lts-alpine

# This version of NodeJS needs Python to run correctly.
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g

# Create app directory
WORKDIR /app
RUN chown -R node:node /app
USER node

# Get the code
COPY dist/* ./

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

EXPOSE 4000

CMD [ "node", "server.js" ]