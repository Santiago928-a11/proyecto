import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http'; // ✅ agregar

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearMuebleComponent } from './components/crear-mueble/crear-mueble.component';
import { EditarMuebleComponent } from './components/editar-mueble/editar-mueble.component';
import { ListaMueblesComponent } from './components/lista-muebles/lista-muebles.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearMuebleComponent,
    EditarMuebleComponent,
    ListaMueblesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    NgChartsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
