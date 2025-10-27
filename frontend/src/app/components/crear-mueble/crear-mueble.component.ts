import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MueblesService, Mueble } from '../../services/muebles.service';

@Component({
  selector: 'app-crear-mueble',
  templateUrl: './crear-mueble.component.html',
  styleUrls: ['./crear-mueble.component.scss']
})
export class CrearMuebleComponent {
  mensaje = '';
  mueble: Mueble = { nombre: '', descripcion: '', precio: 0 };

  constructor(private mueblesService: MueblesService, private router: Router) {}

  crearMueble(form: any) {
    if (form.invalid) return; 

    const formData = new FormData();
    formData.append('nombre', this.mueble.nombre);
    formData.append('descripcion', this.mueble.descripcion);
    formData.append('precio', this.mueble.precio.toString());

    this.mueblesService.createMueble(formData).subscribe({
      next: () => {
        this.mensaje = 'Producto creado con éxito';
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: () => (this.mensaje = 'Error al crear el producto')
    });
  }
}

