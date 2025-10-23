import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaMueblesComponent } from './components/lista-muebles/lista-muebles.component';
import { CrearMuebleComponent } from './components/crear-mueble/crear-mueble.component';
import { EditarMuebleComponent } from './components/editar-mueble/editar-mueble.component';

// Módulo principal de la aplicación Angular.
@NgModule({
  // Declaraciones: lista de componentes, directivas y pipes que pertenecen a este módulo.
  declarations: [
    AppComponent,
    ListaMueblesComponent,
    CrearMuebleComponent,
    EditarMuebleComponent
  ],
  // Imports: otros módulos que este módulo necesita para funcionar.
  imports: [
    BrowserModule,      
    AppRoutingModule,  
    FormsModule,       
    HttpClientModule    
  ],
  // Bootstrap: componente raíz que se carga al iniciar la aplicación.
  bootstrap: [AppComponent]
})
// Clase principal
export class AppModule { }
