import { TestBed } from '@angular/core/testing';

import { StationDataService } from './station-data.service';

describe('StationDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StationDataService = TestBed.get(StationDataService);
    expect(service).toBeTruthy();
  });
});
