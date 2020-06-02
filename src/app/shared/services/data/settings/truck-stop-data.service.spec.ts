import { TestBed } from '@angular/core/testing';

import { TruckStopDataService } from './truck-stop-data.service';

describe('TruckStopDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TruckStopDataService = TestBed.get(TruckStopDataService);
    expect(service).toBeTruthy();
  });
});
