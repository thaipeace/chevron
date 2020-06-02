import { TestBed } from '@angular/core/testing';

import { SupplyPointDataService } from './supply-point-data.service';

describe('SupplyPointDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupplyPointDataService = TestBed.get(SupplyPointDataService);
    expect(service).toBeTruthy();
  });
});
