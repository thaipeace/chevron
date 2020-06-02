import { TestBed } from '@angular/core/testing';

import { DeliveryDataService } from './delivery-data.service';

describe('DeliveryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryDataService = TestBed.get(DeliveryDataService);
    expect(service).toBeTruthy();
  });
});
