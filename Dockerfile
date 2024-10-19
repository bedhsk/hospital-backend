# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /

# Copia el archivo package.json y el package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install 

# Copia el resto del código fuente de la aplicación
COPY . .

# Construye la aplicación de NestJS
RUN npm run build


# Comando para ejecutar la aplicación
CMD ["node", "dist/src/main.js"]  