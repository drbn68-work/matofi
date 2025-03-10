# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./
RUN npm install

# Copia explícitamente tu .env (asegúrate de que no esté en .dockerignore)
COPY .env .env

# Copia el resto del proyecto
COPY . ./

# Construye la aplicación (Vite usará las variables de .env en build time)
RUN npm run build

# Etapa 2: Servir los archivos estáticos con NGINX
FROM nginx:alpine
# Copia la carpeta "dist" generada en la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto de NGINX
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
