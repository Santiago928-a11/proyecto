import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMueblesComponent } from './lista-muebles.component';

describe('ListaMueblesComponent', () => {
  let component: ListaMueblesComponent;
  let fixture: ComponentFixture<ListaMueblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaMueblesComponent]
    });
    fixture = TestBed.createComponent(ListaMueblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
