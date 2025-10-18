from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .crud import crear_mueble, obtener_muebles, obtener_mueble_por_id, actualizar_mueble, eliminar_mueble
from .models import Mueble
import logging
import pandas as pd
import uvicorn

# Crear instancia de FastAPI con título
app = FastAPI(title="Muebles")

# Middleware CORS 
# Permite solicitudes desde cualquier origen y con cualquier método
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints API 

@app.get("/muebles")
def listar_muebles():
    """
    Devuelve la lista de todos los muebles.
    """
    return obtener_muebles()

@app.get("/muebles/{mueble_id}")
def ver_mueble(mueble_id: int):
    """
    Devuelve un mueble específico por ID.
    """
    m = obtener_mueble_por_id(mueble_id)
    if not m:
        raise HTTPException(status_code=404, detail="Mueble no encontrado")
    return m

@app.post("/muebles")
def agregar_mueble(nombre: str = Form(...), descripcion: str = Form(...), precio: float = Form(...)):
    """
    Crea un nuevo mueble usando datos recibidos por formulario.
    """
    logging.info(f"Recibiendo: nombre={nombre}, descripcion={descripcion}, precio={precio}")
    mueble = Mueble(nombre=nombre, descripcion=descripcion, precio=precio)
    try:
        m_id = crear_mueble(mueble)  # Llamada a la función crud
    except Exception as e:
        logging.error(f"Error al crear mueble: {e}")
        raise HTTPException(status_code=500, detail="Error al crear mueble")
    if not m_id:
        raise HTTPException(status_code=500, detail="Error al crear mueble")
    return {"id": m_id}

@app.put("/muebles/{mueble_id}")
def editar_mueble(mueble_id: int, nombre: str = Form(...), descripcion: str = Form(...), precio: float = Form(...)):
    """
    Actualiza un mueble existente por ID.
    """
    mueble = Mueble(nombre=nombre, descripcion=descripcion, precio=precio)
    filas = actualizar_mueble(mueble_id, mueble)
    if filas == 0:
        raise HTTPException(status_code=404, detail="Mueble no encontrado o no actualizado")
    return {"actualizados": filas}

@app.delete("/muebles/{mueble_id}")
def borrar_mueble(mueble_id: int):
    """
    Elimina un mueble por ID.
    """
    filas = eliminar_mueble(mueble_id)
    if filas == 0:
        raise HTTPException(status_code=404, detail="Mueble no encontrado")
    return {"eliminados": filas}

@app.post("/muebles/carga_masiva")
async def carga_masiva(file: UploadFile = File(...)):
    """
    Permite subir un archivo Excel con múltiples muebles y crearlos en la base de datos.
    """
    try:
        df = pd.read_excel(file.file)  # Leer archivo Excel
        columnas = {"nombre", "descripcion", "precio"}
        if not columnas.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"El archivo debe tener las columnas: {columnas}")

        creados = 0
        for _, fila in df.iterrows():
            mueble = Mueble(id=None, nombre=fila["nombre"], descripcion=fila["descripcion"], precio=float(fila["precio"]))
            crear_mueble(mueble)
            creados += 1

        return {"mensaje": f"Se crearon {creados} muebles correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el archivo: {e}")

# --- Run server ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Ejecuta la app en localhost:8000
