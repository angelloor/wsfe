#!/bin/bash
# script tiene que ser puesto en la ruta del postgres /var/lib/postgresql/
# (OJO) su postgres,  y la tarea programa en el usuario postgres
# Nombre de la base de datos
BD_PG_DATABASE='wsfe'

# Directory of backups
BACKUP_FOLDER='/var/lib/postgresql/backups'

# Numero de dias para mantener los backups
DIA_GUARDAR=30

SQL_FILE=respaldo.sql
#SQL_FILE=$BACKUP_FOLDER/backup-$(date +%d-%m-%Y_%H-%M-%S).sql
ZIP_FILE=respaldo.zip
#ZIP_FILE=$BACKUP_FOLDER/backup-$(date +%d-%m-%Y_%H-%M-%S).zip

# Crear carpeta para backup
mkdir -p $BACKUP_FOLDER

# Crear backup
if pg_dump $BD_PG_DATABASE --encoding "UTF8" > $SQL_FILE ; then
   echo 'Backup creado correctamente' $SQL_FILE
else
   echo 'Error al crear el backup de la base '$BD_PG_DATABASE
   #exit
fi
# Comprimir Backup
if gzip -c $SQL_FILE > $ZIP_FILE; then
   echo 'Backup comprimido correctamente' $ZIP_FILE
else
   echo 'Error al comprimir el backup ' $SQL_FILE
   #exit
fi
#rm $SQL_FILE
# Eliminar backups antiguos
find $BACKUP_FOLDER -mtime +$DIA_GUARDAR -delete