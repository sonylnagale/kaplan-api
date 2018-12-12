FROM node:8

# Create app directory
WORKDIR /usr/src/app



# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN cd /usr/src/app/frontend ; npm install

RUN cd ..

EXPOSE 8080 8081

CMD ["npm", "start"]
