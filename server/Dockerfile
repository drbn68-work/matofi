FROM node:18-alpine
WORKDIR /app

COPY ../package.json ./
RUN npm install --only=production

COPY ./server /app

# Copiamos el Excel dentro de /app/public
COPY ./public/catalogomatofi.xlsx /app/public/catalogomatofi.xlsx

EXPOSE 3000
CMD ["node","server.js"]
