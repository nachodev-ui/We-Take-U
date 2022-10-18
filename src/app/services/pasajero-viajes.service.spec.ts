import { TestBed } from '@angular/core/testing';

import { PasajeroViajesService } from './pasajero-viajes.service';

describe('PasajeroViajesService', () => {
  let service: PasajeroViajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasajeroViajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
