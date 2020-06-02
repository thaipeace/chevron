import { TestBed } from '@angular/core/testing';

import { TruckCompanyDataService } from './truck-company-data.service';

describe('TruckCompanyDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TruckCompanyDataService = TestBed.get(TruckCompanyDataService);
    expect(service).toBeTruthy();
  });
});
