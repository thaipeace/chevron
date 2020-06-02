import { TestBed } from '@angular/core/testing';

import { StationInventoryService } from './station-inventory.service';

describe('StationInventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StationInventoryService = TestBed.get(StationInventoryService);
    expect(service).toBeTruthy();
  });
});
