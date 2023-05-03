FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
EXPOSE 3001

ENV GCLOUD_PROJECT=data-mover-beta
ENV GOOGLE_APPLICATION_CREDENTIALS=./google_sheets_service_account_credentials.json

CMD [ "npm", "start" ]