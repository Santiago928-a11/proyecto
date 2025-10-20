import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que representa la estructura de un "Mueble".
 * Se usa para tipar los datos que vienen del backend.
 */
export interface Mueble {
  id?: number;        // id (lo asigna el backend al crear un nuevo mueble)
  nombre: string;     // Nombre del mueble
  descripcion: string;// Descripción del mueble
  precio: number;     // Precio del mueble
}

/**
 * Servicio encargado de realizar las peticiones HTTP
 * entre el frontend (Angular) y el backend (FastAPI).
 * 
 * Se marca con @Injectable para que pueda inyectarse en componentes.
 * 
 * providedIn: 'root' → indica que estará disponible de forma global
 * en toda la aplicación sin necesidad de declararlo en módulos.
 */
@Injectable({ providedIn: 'root' })
export class MueblesService {

  /**
   * URL base de la API del backend.
   */
  private API_URL = 'http://fastapi_muebles:8000/muebles';

  // Inyectamos el cliente HTTP de Angular para hacer peticiones
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de muebles desde el backend.
   * @returns Observable con un arreglo de muebles.
   */
  getMuebles(): Observable<Mueble[]> {
    return this.http.get<Mueble[]>(this.API_URL);
  }

  /**
   * Obtiene un mueble específico según su ID.
   * @param id ID del mueble a consultar
   * @returns Observable con el objeto Mueble
   */
  getMueble(id: number): Observable<Mueble> {
    return this.http.get<Mueble>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuevo mueble enviando sus datos al backend.
   * @param data FormData con los campos del mueble
   * @returns Observable con la respuesta del servidor
   */
  createMueble(data: FormData): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  /**
   * Actualiza un mueble existente.
   * @param id ID del mueble a actualizar
   * @param data FormData con los datos actualizados
   * @returns Observable con la respuesta del servidor
   */
  updateMueble(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  /**
   * Elimina un mueble por su ID.
   * @param id ID del mueble a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteMueble(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /**
   * Envía un archivo XLS para realizar carga masiva de muebles.
   * El backend procesará el archivo para registrar varios muebles a la vez.
   * 
   * @param file Archivo XLS seleccionado por el usuario
   * @returns Observable que emite eventos de progreso y resultado final
   */
  cargaMasiva(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.API_URL}/carga_masiva`, formData, {
      reportProgress: true,  // Muestra el progreso
      observe: 'events'      // Devuelve eventos de progreso y respuesta final
    });
  }
}
