import { TestBed } from '@angular/core/testing';

import { MicsDataService } from './mics-data.service';

describe('MicsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MicsDataService = TestBed.get(MicsDataService);
    expect(service).toBeTruthy();
  });
});
