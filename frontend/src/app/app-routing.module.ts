// Importaciones principales necesarias para definir módulos y rutas en Angular.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaMueblesComponent } from './components/lista-muebles/lista-muebles.component';
import { CrearMuebleComponent } from './components/crear-mueble/crear-mueble.component';
import { EditarMuebleComponent } from './components/editar-mueble/editar-mueble.component';

// Definición de las rutas de la aplicación.
const routes: Routes = [
  { path: '', component: ListaMueblesComponent },   
  { path: 'crear', component: CrearMuebleComponent }, 
  { path: 'editar/:id', component: EditarMuebleComponent },
];

// Módulo de enrutamiento principal de la aplicación.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]                 
})
export class AppRoutingModule { }
