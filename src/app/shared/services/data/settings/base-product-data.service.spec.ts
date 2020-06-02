import { TestBed } from '@angular/core/testing';

import { BaseProductDataService } from './base-product-data.service';

describe('BaseProductDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseProductDataService = TestBed.get(BaseProductDataService);
    expect(service).toBeTruthy();
  });
});
