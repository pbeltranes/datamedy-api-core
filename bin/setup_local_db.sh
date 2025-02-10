#!/bin/bash

# Cargar variables desde .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ Archivo .env no encontrado. Crea un archivo .env con las variables necesarias."
  exit 1
fi

echo "📌 Verificando si PostgreSQL está corriendo..."
if ! pg_isready -q; then
  echo "🚀 Iniciando PostgreSQL..."
  brew services start postgresql
fi

echo "📌 Creando la base de datos y usuario en PostgreSQL..."

# 1️⃣ Crear la base de datos solo si no existe
DB_EXIST=$(psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")
if [ "$DB_EXIST" != "1" ]; then
  echo "📌 Creando la base de datos '$DB_NAME'..."
  createdb $DB_NAME
  echo "✅ Base de datos '$DB_NAME' creada con éxito."
else
  echo "⚠️ La base de datos '$DB_NAME' ya existe."
fi

# 2️⃣ Crear el usuario solo si no existe
USER_EXIST=$(psql -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'")
if [ "$USER_EXIST" != "1" ]; then
  echo "📌 Creando el usuario '$DB_USER'..."
  psql -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
  echo "✅ Usuario '$DB_USER' creado con éxito."
else
  echo "⚠️ El usuario '$DB_USER' ya existe."
fi

# 3️⃣ Asignar permisos al usuario en la base de datos
echo "📌 Otorgando permisos al usuario '$DB_USER' en la base de datos '$DB_NAME'..."
psql -d postgres -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
psql -d postgres -c "ALTER USER $DB_USER WITH CREATEDB CREATEROLE;"

echo "✅ Base de datos y usuario configurados correctamente."
echo "🔗 Conéctate con: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"