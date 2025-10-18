from pydantic import BaseModel

# Modelo de datos para un mueble
class Mueble(BaseModel):
    id: int | None = None
    nombre: str
    descripcion: str
    precio: float
