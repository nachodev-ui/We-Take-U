import { TestBed } from '@angular/core/testing';

import { PasajerosService } from './pasajeros.service';

describe('PasajerosService', () => {
  let service: PasajerosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasajerosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
