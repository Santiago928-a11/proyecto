import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MueblesService, Mueble } from '../../services/muebles.service';

@Component({
  selector: 'app-editar-mueble',
  templateUrl: './editar-mueble.component.html',
  styleUrls: ['./editar-mueble.component.css']
})
export class EditarMuebleComponent implements OnInit {
  mueble: Mueble = { nombre: '', descripcion: '', precio: 0 };
  mensaje = '';
  id!: number;

  // Constructor: inyecta las dependencias necesarias (ruta activa, enrutador y servicio de muebles).
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mueblesService: MueblesService
  ) {}

  // ngOnInit(): se ejecuta al iniciar el componente. Obtiene el ID del mueble desde la URL
  // y carga sus datos desde el backend.
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.mueblesService.getMueble(this.id).subscribe(data => (this.mueble = data));
  }

  // actualizarMueble(): envía los cambios del mueble al backend y muestra un mensaje según el resultado.
  actualizarMueble(form: any) {
    if (form.invalid) return; 

    const formData = new FormData();
    formData.append('nombre', this.mueble.nombre);
    formData.append('descripcion', this.mueble.descripcion);
    formData.append('precio', this.mueble.precio.toString());

    this.mueblesService.updateMueble(this.id, formData).subscribe({
      next: () => {
        this.mensaje = 'Producto actualizado correctamente';
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: () => (this.mensaje = 'Error al actualizar el producto')
    });
  }
}
