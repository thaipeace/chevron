import { TestBed } from '@angular/core/testing';

import { QuotaDataService } from './quota-data.service';

describe('QuotaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuotaDataService = TestBed.get(QuotaDataService);
    expect(service).toBeTruthy();
  });
});
