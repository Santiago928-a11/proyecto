import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mueble {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class MueblesService {
  private API_URL = '/muebles';
  constructor(private http: HttpClient) {}

  getMuebles(): Observable<Mueble[]> {
    return this.http.get<Mueble[]>(this.API_URL);
  }

  getMueble(id: number): Observable<Mueble> {
    return this.http.get<Mueble>(`${this.API_URL}/${id}`);
  }

  createMueble(data: FormData): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  updateMueble(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  deleteMueble(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  cargaMasiva(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API_URL}/carga_masiva`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
