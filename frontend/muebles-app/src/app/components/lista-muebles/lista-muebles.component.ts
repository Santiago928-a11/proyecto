import { Component, OnInit } from '@angular/core';
import { MueblesService, Mueble } from '../../services/muebles.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-lista-muebles', 
  templateUrl: './lista-muebles.component.html',
  styleUrls: ['./lista-muebles.component.css']
})

// Componente encargado de mostrar la lista de muebles, permitir su eliminación
// y gestionar la carga masiva de datos desde un archivo XLS.
export class ListaMueblesComponent implements OnInit {
  // Arreglo que almacena la lista de muebles obtenida del backend.
  muebles: Mueble[] = [];

  // Mensaje informativo que muestra el resultado de las operaciones (éxito o error).
  mensaje = '';

  // Porcentaje de progreso durante la carga de archivos XLS.
  progreso = 0;

  // Constructor: inyecta el servicio de muebles para interactuar con el backend.
  constructor(private mueblesService: MueblesService) {}

  // ngOnInit(): método del ciclo de vida de Angular, se ejecuta al iniciar el componente.
  // Llama a la función que carga los muebles desde el backend.
  ngOnInit() {
    this.cargarMuebles();
  }

  // cargarMuebles(): obtiene la lista de muebles desde el backend y la almacena en el arreglo "muebles".
  cargarMuebles() {
    this.mueblesService.getMuebles().subscribe({
      next: data => (this.muebles = data),
      error: err => console.error(err)
    });
  }

  // borrarMueble(): elimina un mueble según su ID luego de una confirmación del usuario.
  // Si la operación es exitosa, recarga la lista de muebles.
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

  // onFileSelect(): maneja la selección de un archivo XLS y envía el archivo al backend.
  // Actualiza el progreso de carga y muestra mensajes de estado.
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.progreso = 0;
    this.mensaje = '';

    this.mueblesService.cargaMasiva(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.mensaje = 'Carga completa';
          this.cargarMuebles();
        }
      },
      error: () => (this.mensaje = 'Error, no se pudo subir el archivo')
    });
  }
}
