import { Component } from '@angular/core';

// Componente principal de la aplicación Angular.
// Define el selector (<app-root>), el HTML asociado y los estilos.
// Sirve como punto de entrada para renderizar toda la app.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Título de la aplicación, usado en la plantilla.
  title = 'Proyecto Muebles';
}
