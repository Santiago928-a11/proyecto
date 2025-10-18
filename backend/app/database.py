import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import logging

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración de conexión a MySQL usando variables de entorno
DB_HOST = os.getenv("MYSQL_HOST", "mysql_muebles")
DB_USER = os.getenv("MYSQL_USER", "usuario")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "contraseña")
DB_NAME = os.getenv("MYSQL_DATABASE", "muebles")
DB_PORT = int(os.getenv("MYSQL_PORT", 3306))

# Configuración básica del logging
logging.basicConfig(level=logging.INFO)

def get_connection():
    """
    Establece y retorna una conexión a la base de datos MySQL.
    """
    connection = None
    try:
        # Conectar a MySQL
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )
        if connection.is_connected():
            logging.info("Conexión MySQL exitosa")  # Confirmar conexión
        return connection
    except Error as e:
        logging.error(f"Error al conectar a la base de datos: {e}")
        return None

def crear_tabla_muebles():
    """
    Crea la tabla 'muebles' si no existe.
    """
    connection = get_connection()  # Obtener conexión
    if connection:
        try:
            cursor = connection.cursor()
            # SQL para crear tabla de muebles
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS muebles (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL,
                    descripcion TEXT,
                    precio DECIMAL(10,2) NOT NULL
                )
            """)
            connection.commit()  # Confirmar creación de tabla
            logging.info("Tabla 'muebles' creada")
        except Error as e:
            logging.error(f"Error al crear tabla: {e}")
        finally:
            # Cerrar cursor y conexión
            cursor.close()
            connection.close()

