import { TestBed } from '@angular/core/testing';

import { TruckDataService } from './truck-data.service';

describe('TruckDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TruckDataService = TestBed.get(TruckDataService);
    expect(service).toBeTruthy();
  });
});
