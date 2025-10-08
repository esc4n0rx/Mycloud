# Estágio 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia os arquivos de manifesto de dependências
COPY package.json pnpm-lock.yaml ./

# Instala as dependências
RUN pnpm install

# Copia o restante do código-fonte
COPY . .

# Builda o projeto TypeScript
RUN pnpm run build

# Estágio 2: Imagem final de produção
FROM node:18-alpine

WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Define o ambiente como produção
ENV NODE_ENV=production

# Copia os arquivos de manifesto para instalar apenas as dependências de produção
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copia os artefatos de build do estágio anterior
COPY --from=builder /app/dist ./dist

# Copia o arquivo de configuração do pm2
COPY ecosystem.config.js .

# Cria a pasta de uploads que será o ponto de montagem do volume
RUN mkdir -p /uploads

# Declara o volume para persistência de dados
VOLUME /uploads

# Expõe a porta da aplicação
EXPOSE 4500

# Comando para iniciar a aplicação com pm2
CMD pm2-runtime start ecosystem.config.js --env production
