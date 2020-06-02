import { TestBed } from '@angular/core/testing';

import { InventoryDataService } from './inventory-data.service';

describe('InventoryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryDataService = TestBed.get(InventoryDataService);
    expect(service).toBeTruthy();
  });
});
