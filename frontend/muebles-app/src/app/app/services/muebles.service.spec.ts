import { TestBed } from '@angular/core/testing';

import { MueblesService } from './muebles.service';

describe('MueblesService', () => {
  let service: MueblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MueblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


