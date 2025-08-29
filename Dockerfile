# Estágio 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de manifesto de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Builda o projeto TypeScript
RUN npm run build

# Estágio 2: Imagem final de produção
FROM node:18-alpine

WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV=production

# Copia os arquivos de manifesto para instalar apenas as dependências de produção
COPY package*.json ./
RUN npm install --production

# Copia os artefatos de build do estágio anterior
COPY --from=builder /app/dist ./dist

# Cria a pasta de uploads que será o ponto de montagem do volume
RUN mkdir -p /uploads

# Declara o volume para persistência de dados
VOLUME /uploads

# Expõe a porta da aplicação
EXPOSE 4500

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
