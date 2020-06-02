import { TestBed } from '@angular/core/testing';

import { FleetBaseDataService } from './fleet-base-data.service';

describe('FleetBaseDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetBaseDataService = TestBed.get(FleetBaseDataService);
    expect(service).toBeTruthy();
  });
});
