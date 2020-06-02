import { TestBed } from '@angular/core/testing';

import { TripPreferenceService } from './trip-preference.service';

describe('TripPreferenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TripPreferenceService = TestBed.get(TripPreferenceService);
    expect(service).toBeTruthy();
  });
});
