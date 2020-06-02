import { TestBed } from '@angular/core/testing';

import { CustomerTreeviewLoadingService } from './customer-treeview-loading.service';

describe('CustomerTreeviewLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerTreeviewLoadingService = TestBed.get(CustomerTreeviewLoadingService);
    expect(service).toBeTruthy();
  });
});
