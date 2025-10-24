import { Component, OnInit } from '@angular/core';
import { MueblesService, Mueble } from '../../services/muebles.service';
import { HttpEventType } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-muebles',
  templateUrl: './lista-muebles.component.html',
  styleUrls: ['./lista-muebles.component.css']
})

export class ListaMueblesComponent implements OnInit {
  muebles: Mueble[] = [];
  mensaje = '';
  progreso = 0;

  hojasDisponibles: string[] = [];
  hojasSeleccionadas: string[] = [];
  archivo: File | null = null;

  // vista previa de datos
  vistaPrevia: any[] = [];
  hojaVistaPrevia: string | null = null;

  mostrarModal = false;
  hojasValidasPreview: { nombre: string, datos: any[] }[] = [];


  constructor(private mueblesService: MueblesService) {}

  ngOnInit() {
    this.cargarMuebles();
  }

  cargarMuebles() {
    this.mueblesService.getMuebles().subscribe({
      next: data => (this.muebles = data),
      error: err => console.error(err)
    });
  }

  borrarMueble(id: number) {
    if (!confirm(`¿Seguro que quieres borrar ${id}?`)) return;
    this.mueblesService.deleteMueble(id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente';
        this.cargarMuebles();
      },
      error: () => (this.mensaje = 'Error, no se pudo borrar el mueble')
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.archivo = file;
    this.hojasDisponibles = [];
    this.hojasSeleccionadas = [];
    this.progreso = 0;
    this.mensaje = '';
    this.vistaPrevia = [];
    this.hojaVistaPrevia = null;
    this.hojasValidasPreview = [];

    this.mueblesService.analizarExcel(file).subscribe({
      next: (res: any) => {
        this.hojasDisponibles = res.hojas_validas;
        if (this.hojasDisponibles.length > 0) {
          this.leerTodasLasHojas(file, this.hojasDisponibles);
        }
      },
      error: () => {
        this.mensaje = 'Error al analizar el archivo';
      }
    });
  }

  leerTodasLasHojas(file: File, hojas: string[]) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      this.hojasValidasPreview = hojas.map(hoja => {
        const sheet = workbook.Sheets[hoja];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        return {
          nombre: hoja,
          datos: jsonData.slice(0, 10) 
        };
      });
      this.mostrarModal = true;
    };
    reader.readAsArrayBuffer(file);
  }

  toggleHojaSeleccionada(hoja: string, event: any) {
    if (event.target.checked) {
      if (!this.hojasSeleccionadas.includes(hoja)) {
        this.hojasSeleccionadas.push(hoja);
      }
      this.mostrarVistaPrevia(hoja); 
    } else {
      this.hojasSeleccionadas = this.hojasSeleccionadas.filter(h => h !== hoja);
      if (this.hojaVistaPrevia === hoja) {
        this.vistaPrevia = [];
        this.hojaVistaPrevia = null;
      }
    }
  }

  mostrarVistaPrevia(hoja: string) {
    if (!this.archivo) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[hoja];
      if (!sheet) return;

      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      this.vistaPrevia = jsonData.slice(0, 5); 
      this.hojaVistaPrevia = hoja;
    };
    reader.readAsArrayBuffer(this.archivo);
  }

  subirHojasSeleccionadas() {
    if (!this.archivo || this.hojasSeleccionadas.length === 0) {
      this.mensaje = 'Seleccione al menos una hoja para subir';
      return;
    }

    this.progreso = 0;
    this.mueblesService.cargaMasivaHojas(this.archivo, this.hojasSeleccionadas).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.mensaje = 'Carga completa';
          this.cargarMuebles();

          this.hojasDisponibles = [];
          this.hojasSeleccionadas = [];
          this.archivo = null;
          this.vistaPrevia = [];
          this.hojasValidasPreview = [];
          this.mostrarModal = false; 
          this.progreso = 0;

          const input = document.querySelector('.file-input') as HTMLInputElement;
          if (input) input.value = '';
        }
      },
      error: () => {
        this.mensaje = 'Error, no se pudo subir el archivo';
        this.mostrarModal = false; 
      }
    });
  }


  cerrarModal() {
    this.mostrarModal = false;
  }
}

