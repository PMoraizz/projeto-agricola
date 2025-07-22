# FROM node:18

# # Instala as dependências do sistema para o Chromium (Puppeteer)
# RUN apt-get update && apt-get install -y \
#   wget \
#   ca-certificates \
#   fonts-liberation \
#   libappindicator3-1 \
#   libasound2 \
#   libatk-bridge2.0-0 \
#   libatk1.0-0 \
#   libcups2 \
#   libdbus-1-3 \
#   libgdk-pixbuf2.0-0 \
#   libnspr4 \
#   libnss3 \
#   libx11-xcb1 \
#   libxcomposite1 \
#   libxdamage1 \
#   libxrandr2 \
#   xdg-utils \
#   libgbm1 \
#   libxshmfence1 \
#   libgtk-3-0 \
#   --no-install-recommends \
#   && apt-get clean && rm -rf /var/lib/apt/lists/*

# # Cria diretório de trabalho
# WORKDIR /app

# # Copia os arquivos do projeto
# COPY . .

# # Instala dependências Node.js
# RUN npm install

# # Expõe a porta interna da aplicação
# EXPOSE 3000

# # Comando padrão
# CMD ["npm", "start"]

# --- Estágio 1: Base de Construção (Build Stage) ---
# Usamos a imagem completa do Node 18 para ter as ferramentas de compilação
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento (para os testes)
RUN npm install

# Copia todo o resto do código da sua aplicação
COPY . .


# --- Estágio 2: Produção (Production Stage) ---
# Começamos de uma imagem nova e limpa, a 'alpine', que é muito leve
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências do estágio de construção
COPY --from=builder /usr/src/app/package*.json ./

# Instala APENAS as dependências de produção, de forma otimizada
RUN npm ci --only=production

# Copia o código da aplicação já preparado do estágio de construção
COPY --from=builder /usr/src/app .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]