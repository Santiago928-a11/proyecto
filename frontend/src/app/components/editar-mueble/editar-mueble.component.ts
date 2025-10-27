import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MueblesService, Mueble } from '../../services/muebles.service';

@Component({
  selector: 'app-editar-mueble',
  templateUrl: './editar-mueble.component.html',
  styleUrls: ['./editar-mueble.component.scss']
})
export class EditarMuebleComponent implements OnInit {
  mueble: Mueble = { nombre: '', descripcion: '', precio: 0 };
  mensaje = '';
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mueblesService: MueblesService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (!paramId) {
      this.mensaje = 'ID del mueble no proporcionado';
      return;
    }

    this.id = Number(paramId);

    this.mueblesService.getMueble(this.id).subscribe({
      next: (data: Mueble) => {
        this.mueble = data;
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al cargar el mueble';
      }
    });
  }

  actualizarMueble(form: any): void {
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
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al actualizar el producto';
      }
    });
  }
}

