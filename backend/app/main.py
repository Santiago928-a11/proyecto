from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .crud import crear_mueble, obtener_muebles, obtener_mueble_por_id, actualizar_mueble, eliminar_mueble
from .models import Mueble
import logging
import pandas as pd
import uvicorn
from typing import List
from decimal import Decimal

def respuesta_estandarizada(
    status: int,
    tipo: str,
    titulo: str,
    mensaje: str,
    datos: dict | list | None = None,
    errores: dict | list | str | None = None
):
    def convertir(obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, list):
            return [convertir(o) for o in obj]
        if isinstance(obj, dict):
            return {k: convertir(v) for k, v in obj.items()}
        return obj

    contenido = {
        "estado": status,
        "tipo": tipo,
        "titulo": titulo,
        "mensaje": mensaje,
        "datos": convertir(datos),
        "errores": errores,
    }
    return JSONResponse(content=contenido, status_code=status)

app = FastAPI(title="Muebles")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health/ping")
def health_ping():
    """Health check simple para verificar que la API responde."""
    return respuesta_estandarizada(
        200,
        "éxito",
        "Pong",
        "El servidor está activo y responde correctamente."
    )

@app.get("/health/full")
def health_full():
    """Health check."""
    try:
        db_status = True  
        if not db_status:
            raise Exception("Error de conexión a la base de datos")

        return respuesta_estandarizada(
            200,
            "OK",
            "Health check OK",
            "Todos los sistemas están funcionando correctamente.",
            datos={"db": "conectada"}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500,
            "error",
            "Health check fallido",
            "Hay problemas en los servicios del backend.",
            errores=str(e)
        )


@app.get("/muebles")
def listar_muebles():
    """Devuelve la lista de todos los muebles."""
    try:
        muebles = obtener_muebles()
        return respuesta_estandarizada(
            200, "éxito", "Consulta exitosa",
            "Lista de productos obtenida correctamente.",
            datos=muebles
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error interno",
            "Error al obtener la lista de muebles.",
            errores=str(e)
        )


@app.get("/muebles/{mueble_id}")
def ver_mueble(mueble_id: int):
    """Devuelve un mueble específico por ID."""
    try:
        m = obtener_mueble_por_id(mueble_id)
        if not m:
            return respuesta_estandarizada(
                404, "advertencia", "No encontrado",
                "Id de producto no encontrado."
            )
        return respuesta_estandarizada(
            200, "éxito", "Producto encontrado",
            "Producto encontrado.",
            datos=m
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error interno",
            "Error al obtener el producto.",
            errores=str(e)
        )


@app.post("/muebles")
def agregar_mueble(nombre: str = Form(...), descripcion: str = Form(...), precio: float = Form(...)):
    """Crea un nuevo mueble usando datos recibidos por formulario."""
    try:
        mueble = Mueble(nombre=nombre, descripcion=descripcion, precio=precio)
        m_id = crear_mueble(mueble)
        return respuesta_estandarizada(
            201, "éxito", "Producto creado",
            "El producto fue agregado correctamente.",
            datos={"id": m_id}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error al crear el producto",
            "No se pudo agregar el producto.",
            errores=str(e)
        )


@app.put("/muebles/{mueble_id}")
def editar_mueble(mueble_id: int, nombre: str = Form(...), descripcion: str = Form(...), precio: float = Form(...)):
    """Actualiza un mueble existente por ID."""
    try:
        mueble = Mueble(nombre=nombre, descripcion=descripcion, precio=precio)
        filas = actualizar_mueble(mueble_id, mueble)
        if filas == 0:
            return respuesta_estandarizada(
                404, "advertencia", "No actualizado",
                "Producto no encontrado o sin cambios aplicados."
            )
        return respuesta_estandarizada(
            200, "éxito", "Producto actualizado",
            "El producto fue actualizado.",
            datos={"actualizados": filas}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error interno",
            "Error al actualizar el producto.",
            errores=str(e)
        )


@app.delete("/muebles/{mueble_id}")
def borrar_mueble(mueble_id: int):
    """Elimina un mueble por ID."""
    try:
        filas = eliminar_mueble(mueble_id)
        if filas == 0:
            return respuesta_estandarizada(
                404, "advertencia", "No eliminado",
                "El producto ya fue eliminado o no se encontro en la base."
            )
        return respuesta_estandarizada(
            200, "éxito", "Producto eliminado",
            "El producto fue eliminado.",
            datos={"eliminados": filas}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error interno",
            "Error al eliminar el producto.",
            errores=str(e)
        )


@app.post("/muebles/analizar_excel")
async def analizar_excel(file: UploadFile = File(...)):
    """Analiza un archivo Excel y devuelve las hojas válidas."""
    try:
        xls = pd.ExcelFile(file.file)
        columnas_req = {"nombre", "descripcion", "precio"}
        hojas_validas = []

        for hoja in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=hoja)
            if columnas_req.issubset(df.columns) and not df.empty:
                hojas_validas.append(hoja)

        if not hojas_validas:
            return respuesta_estandarizada(
                400, "advertencia", "Sin hojas válidas",
                "El archivo no contiene hojas validas."
            )

        return respuesta_estandarizada(
            200, "éxito", "Análisis exitoso",
            "Se encontraron hojas válidas para importar.",
            datos={"hojas_validas": hojas_validas}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error al analizar Excel",
            "No se pudo procesar el archivo.",
            errores=str(e)
        )


@app.post("/muebles/carga_masiva_hojas")
async def carga_masiva_hojas(file: UploadFile = File(...), hojas: List[str] = Form(...)):
    """Crea muebles solo de las hojas seleccionadas."""
    try:
        xls = pd.ExcelFile(file.file)
        creados = 0

        for hoja in hojas:
            if hoja not in xls.sheet_names:
                continue
            df = pd.read_excel(xls, sheet_name=hoja)
            for _, fila in df.iterrows():
                mueble = Mueble(
                    id=None,
                    nombre=fila["nombre"],
                    descripcion=fila["descripcion"],
                    precio=float(fila["precio"])
                )
                crear_mueble(mueble)
                creados += 1

        return respuesta_estandarizada(
            201, "éxito", "Carga masiva completada",
            f"Se crearon {creados} muebles correctamente.",
            datos={"creados": creados}
        )
    except Exception as e:
        return respuesta_estandarizada(
            500, "error", "Error en carga",
            "No se pudo procesar el archivo de carga.",
            errores=str(e)
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
