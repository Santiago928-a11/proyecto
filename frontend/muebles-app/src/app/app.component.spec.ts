import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  // Antes de cada prueba, se configura el entorno de pruebas.
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],  
    declarations: [AppComponent]     
  }));

  // Verifica que el componente se cree correctamente.
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); 
    const app = fixture.componentInstance;                 
    expect(app).toBeTruthy();                             
  });

  // Verifica que el valor de la propiedad "title" sea el esperado.
  it(`should have as title 'Proyecto Muebles'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Proyecto Muebles');              
  });

  // Verifica que el título se muestre correctamente en el HTML renderizado.
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();                               
    const compiled = fixture.nativeElement as HTMLElement; 

    expect(compiled.querySelector('.content span')?.textContent)
      .toContain('muebles-app app is running!');
  });
});

