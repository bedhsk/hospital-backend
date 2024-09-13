# Usa una imagen base de Node.js para la fase de construcción
FROM node:18-alpine as BUILDER

# Establece el entorno de desarrollo
ENV NODE_ENV=development

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero para aprovechar la caché
COPY package*.json ./

# Instala las dependencias de la aplicación utilizando npm ci para respetar el lockfile
RUN npm ci

# Copia el resto del código fuente de la aplicación
COPY . .

# Construye la aplicación de NestJS
RUN npm run build
# Prune las dependencias para eliminar las devDependencies
RUN npm prune --production
#_______________________________________________________________________________________
# Fase de producción
FROM node:18-alpine as PRODUCTION

# Establece el entorno de producción
ENV NODE_ENV=production
ENV PORT=3000

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias y el código compilado desde la fase de construcción
COPY --from=BUILDER /app/package*.json ./
COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/node_modules ./node_modules

# Prune de dependencias innecesarias para producción
RUN npm prune --production

# Expone el puerto para la aplicación
EXPOSE ${PORT}

# Comando para ejecutar la aplicación
CMD ["node", "dist/src/main.js"]
