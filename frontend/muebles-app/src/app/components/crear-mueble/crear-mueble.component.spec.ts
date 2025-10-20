import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMuebleComponent } from './crear-mueble.component';

describe('CrearMuebleComponent', () => {
  let component: CrearMuebleComponent;
  let fixture: ComponentFixture<CrearMuebleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearMuebleComponent]
    });
    fixture = TestBed.createComponent(CrearMuebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
