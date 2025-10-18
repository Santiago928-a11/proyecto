from .database import get_connection  
from .models import Mueble           
from mysql.connector import Error     
import logging

# Configuración básica del logging para mostrar info y errores
logging.basicConfig(level=logging.INFO)

def crear_mueble(mueble: Mueble):
    """
    Inserta un mueble en la base de datos.
    """
    connection = None
    try:
        # Obtener conexión y crear cursor
        connection = get_connection()
        cursor = connection.cursor()
        # SQL para insertar un mueble
        sql = "INSERT INTO muebles (nombre, descripcion, precio) VALUES (%s, %s, %s)"
        cursor.execute(sql, (mueble.nombre, mueble.descripcion, mueble.precio))
        connection.commit()  # Confirmar cambios
        return cursor.lastrowid  # Retornar el id del nuevo mueble
    except Error as e:
        logging.error(f"Error al crear mueble: {e}")  # Registrar error
        return None
    finally:
        # Cerrar cursor y conexión si están abiertos
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def obtener_muebles():
    """
    Obtiene todos los muebles de la base de datos.
    """
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)  # Retorna filas como diccionarios
        cursor.execute("SELECT * FROM muebles")
        result = cursor.fetchall()  # Obtener todos los registros
        return result
    except Error as e:
        logging.error(f"Error al obtener muebles: {e}")
        return []
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def obtener_mueble_por_id(mueble_id: int):
    """
    Obtiene un mueble por su ID.
    """
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM muebles WHERE id=%s", (mueble_id,))
        result = cursor.fetchone()  # Obtener un solo registro
        return result
    except Error as e:
        logging.error(f"Error al obtener mueble por id: {e}")
        return None
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def actualizar_mueble(mueble_id: int, mueble: Mueble):
    """
    Actualiza los datos de un mueble por ID.
    """
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        # SQL para actualizar los campos de un mueble
        sql = "UPDATE muebles SET nombre=%s, descripcion=%s, precio=%s WHERE id=%s"
        cursor.execute(sql, (mueble.nombre, mueble.descripcion, mueble.precio, mueble_id))
        connection.commit()  # Confirmar cambios
        return cursor.rowcount  # Retorna número de filas afectadas
    except Error as e:
        logging.error(f"Error al actualizar mueble: {e}")
        return 0
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def eliminar_mueble(mueble_id: int):
    """
    Elimina un mueble de la base de datos por ID.
    """
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        # SQL para eliminar un mueble
        cursor.execute("DELETE FROM muebles WHERE id=%s", (mueble_id,))
        connection.commit()
        return cursor.rowcount  # Retorna número de filas eliminadas
    except Error as e:
        logging.error(f"Error al eliminar mueble: {e}")
        return 0
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

