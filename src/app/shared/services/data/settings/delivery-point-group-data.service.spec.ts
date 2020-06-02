import { TestBed } from '@angular/core/testing';

import { DeliveryPointGroupDataService } from './delivery-point-group-data.service';

describe('DeliveryPointGroupDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryPointGroupDataService = TestBed.get(DeliveryPointGroupDataService);
    expect(service).toBeTruthy();
  });
});
