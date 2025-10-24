# Imagen base estable con soporte completo de OpenSSL y npm
FROM node:20-bullseye

# Directorio de trabajo
WORKDIR /app

# Copiar solo archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Instalar librerías adicionales (como xlsx)
RUN npm install xlsx @types/xlsx

# Copiar el resto del código
COPY . .

# Exponer puerto (Angular usa 4200 por defecto)
EXPOSE 4200

# Comando por defecto
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
