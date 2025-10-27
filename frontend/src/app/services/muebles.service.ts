import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface Mueble {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface RespuestaMuebles {
  estado: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  datos: Mueble[];
  errores?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MueblesService {
  private apiUrl = `${environment.apiUrl}/muebles`; 

  constructor(private http: HttpClient) {}

  getMuebles(): Observable<RespuestaMuebles> {
    return this.http.get<RespuestaMuebles>(this.apiUrl);
  }

  getMueble(id: number): Observable<Mueble> {
    return this.http.get<{ datos: Mueble }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.datos) // extraemos el objeto Mueble del wrapper
      );
  }

  createMueble(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateMueble(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteMueble(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cargaMasiva(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/carga_masiva`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  analizarExcel(file: File): Observable<RespuestaMuebles> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<RespuestaMuebles>(`${this.apiUrl}/analizar_excel`, formData);
  }

  cargaMasivaHojas(file: File, hojas: string[]): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    hojas.forEach(h => formData.append('hojas', h));
    return this.http.post(`${this.apiUrl}/carga_masiva_hojas`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}

