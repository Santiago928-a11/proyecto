import { Component, OnInit } from '@angular/core';
import { MueblesService, Mueble } from '../../services/muebles.service';
import { HttpEventType } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-lista-muebles',
  templateUrl: './lista-muebles.component.html',
  styleUrls: ['./lista-muebles.component.scss']
})
export class ListaMueblesComponent implements OnInit {
  muebles: Mueble[] = [];
  mensaje = '';
  progreso = 0;
  hojasDisponibles: string[] = [];
  hojasSeleccionadas: string[] = [];
  archivo: File | null = null;
  hojasValidasPreview: { nombre: string, datos: any[] }[] = [];
  hojaVistaPrevia: string | null = null;
  vistaPrevia: any[] = [];
  mostrarModal = false;

  mostrarConfirmacion = false;
  mensajeConfirmacion = '';
  accionConfirmada: (() => void) | null = null;

  chartData: ChartData<'doughnut'> = {
    labels: ['≤ 100.000', '100.001–200.000', '200.001–300.000', '300.001–400.000'],
    datasets: [
      {
        label: 'Cantidad de Muebles',
        data: [0, 0, 0, 0],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
        hoverOffset: 10
      }
    ]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Distribución de precios de los muebles' }
    }
  };

  constructor(private mueblesService: MueblesService) {}

  ngOnInit() {
    this.cargarMuebles();
  }

  cargarMuebles() {
    this.mueblesService.getMuebles().subscribe({
      next: res => {
        this.muebles = res.datos || [];
        this.actualizarGrafico();
      },
      error: err => console.error(err)
    });
  }

  actualizarGrafico() {
    const categorias = [0, 0, 0, 0];

    for (const mueble of this.muebles) {
      const precio = mueble.precio;
      if (precio <= 100000) categorias[0]++;
      else if (precio <= 200000) categorias[1]++;
      else if (precio <= 300000) categorias[2]++;
      else if (precio <= 400000) categorias[3]++;
    }

    this.chartData = {
      ...this.chartData,
      datasets: [{ ...this.chartData.datasets[0], data: categorias }]
    };
  }

  borrarMueble(id: number) {
    this.mostrarModalConfirmacion(
      `¿Seguro que quieres borrar el mueble con ID ${id}?`,
      () => {
        this.mueblesService.deleteMueble(id).subscribe({
          next: () => {
            this.mensaje = 'Producto eliminado correctamente';
            this.cargarMuebles();
          },
          error: () => (this.mensaje = 'Error, no se pudo borrar el mueble')
        });
      }
    );
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.mostrarModalConfirmacion('¿Seguro que quiere subir este archivo?', () => {
      this.archivo = file;
      this.hojasDisponibles = [];
      this.hojasSeleccionadas = [];
      this.vistaPrevia = [];
      this.hojaVistaPrevia = null;
      this.hojasValidasPreview = [];
      this.progreso = 0;
      this.mensaje = '';

      this.mueblesService.analizarExcel(file).subscribe({
        next: (res: any) => {
          this.hojasDisponibles = res.datos?.hojas_validas || [];
          this.hojasValidasPreview = res.datos?.hojas_preview || [];

          if (this.hojasDisponibles.length === 0) {
            this.mensaje = 'No se encontraron hojas válidas.';
          } else if (this.hojasDisponibles.length === 1) {
            this.hojasSeleccionadas = [this.hojasDisponibles[0]];
            this.subirHojasSeleccionadas();
          } else {
            this.mostrarModal = true; // mostrar modal con preview
          }
        },
        error: () => (this.mensaje = 'Error al analizar el archivo')
      });
    });
  }

  toggleHojaSeleccionada(hoja: string, event: any) {
    if (event.target.checked) {
      if (!this.hojasSeleccionadas.includes(hoja)) this.hojasSeleccionadas.push(hoja);
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
    const hojaPreview = this.hojasValidasPreview.find(h => h.nombre === hoja);
    if (hojaPreview) {
      this.vistaPrevia = hojaPreview.datos;
      this.hojaVistaPrevia = hoja;
    }
  }

  subirHojasSeleccionadas() {
    if (!this.archivo || this.hojasSeleccionadas.length === 0) {
      this.mensaje = 'Seleccione al menos una hoja para subir';
      return;
    }

    this.mostrarModalConfirmacion('¿Desea guardar las hojas seleccionadas en la base de datos?', () => {
      this.progreso = 0;
      this.mueblesService.cargaMasivaHojas(this.archivo!, this.hojasSeleccionadas).subscribe({
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
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  mostrarModalConfirmacion(mensaje: string, accion: () => void) {
    this.mensajeConfirmacion = mensaje;
    this.accionConfirmada = accion;
    this.mostrarConfirmacion = true;
  }

  confirmarAccion() {
    if (this.accionConfirmada) this.accionConfirmada();
    this.cerrarConfirmacion();
  }

  cerrarConfirmacion() {
    this.mostrarConfirmacion = false;
    this.mensajeConfirmacion = '';
    this.accionConfirmada = null;
  }
}


