#!/bin/bash

set -e

echo "Aguardando banco de dados..."
while ! python -c "import socket; socket.create_connection(('$DB_HOST', ${DB_PORT:-5432}))" 2>/dev/null; do
    sleep 1
done
echo "Banco de dados disponível!"

echo "Aplicando migrations..."
python manage.py migrate --noinput

echo "Iniciando Gunicorn na porta 8001..."
exec gunicorn core.wsgi:application \
    --bind 0.0.0.0:8001 \
    --workers 2 \
    --threads 2 \
    --access-logfile - \
    --error-logfile -
