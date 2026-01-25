FROM node:24-alpine

WORKDIR /app

# Install system dependencies if needed (e.g. for some npm packages or prisma)
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
