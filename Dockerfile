# ===========================================
# Stage 1: Build do Frontend Angular
# ===========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copia arquivos de dependências primeiro (cache)
COPY frontend-pessoa/package*.json ./

# Instala dependências
RUN npm ci

# Copia código do frontend
COPY frontend-pessoa/ ./

# Build de produção
RUN npm run build -- --configuration=production

# ===========================================
# Stage 2: Backend Django + Frontend compilado
# ===========================================
FROM python:3.10-slim

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn whitenoise

# Copia código do backend
COPY . .

# Coleta arquivos estáticos do Django PRIMEIRO
RUN python manage.py collectstatic --noinput

# Copia frontend compilado do stage anterior DEPOIS (para não ser sobrescrito)
COPY --from=frontend-builder /app/frontend/dist/frontend-pessoa/browser ./staticfiles/

# Renomeia index.csr.html para index.html (Angular 17+ SSR build)
RUN if [ -f ./staticfiles/index.csr.html ]; then mv ./staticfiles/index.csr.html ./staticfiles/index.html; fi

# Remove arquivos desnecessários
RUN rm -rf frontend-pessoa node_modules

# Porta do Gunicorn
EXPOSE 8001

# Permissão do entrypoint
RUN chmod +x /app/entrypoint.sh

# Comando de inicialização
ENTRYPOINT ["/app/entrypoint.sh"]
