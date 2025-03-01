#!/bin/bash

# Configuración
CONTAINER_NAME="postgres"
DB_USER="admin"
DB_NAME="hospital"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.sql"

# Ruta de configuración de rclone (ajústala si es diferente)
RCLONE_CONFIG="/root/.config/rclone/rclone.conf"  # Modifica si usas otro usuario

# Asegurar que el directorio de backups existe
mkdir -p "$BACKUP_DIR"

# Realiza el backup desde el contenedor de PostgreSQL
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -F c -b -v -f /tmp/backup.sql "$DB_NAME"
sudo docker cp "$CONTAINER_NAME:/tmp/backup.sql" "/tmp/backup.sql"
mv "/tmp/backup.sql" "$BACKUP_FILE"


# Subir el backup a Google Drive usando la configuración correcta
rclone --config "$RCLONE_CONFIG" copy "$BACKUP_FILE" drive:Backups/ --progress

# Eliminar backups antiguos (opcional, borra los de más de 7 días)
find "$BACKUP_DIR" -type f -mtime +7 -name "*.sql" -exec rm {} \;

echo "✅ Backup realizado y guardado en Google Drive: $BACKUP_FILE"
