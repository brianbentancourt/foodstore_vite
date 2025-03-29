#!/bin/bash

# Lista de clientes a compilar
CLIENTES=("restauranteA" "restauranteB" "restauranteC")

# Directorio donde se guardarán las builds
DEPLOY_DIR="./builds"

# Crear directorio de builds si no existe
mkdir -p $DEPLOY_DIR

# Compilar para cada cliente
for cliente in "${CLIENTES[@]}"
do
   echo "Compilando para cliente: $cliente"
   
   # Cambiar el ID del cliente y compilar
   export REACT_APP_CLIENT_ID=$cliente
   npm run build
   
   # Crear directorio para este cliente si no existe
   mkdir -p "$DEPLOY_DIR/$cliente"
   
   # Copiar los archivos compilados
   cp -r build/* "$DEPLOY_DIR/$cliente/"
   
   echo "Compilación completada para $cliente"
   echo "-----------------------------------"
done

echo "Todas las compilaciones han sido completadas."
echo "Las builds están disponibles en: $DEPLOY_DIR"