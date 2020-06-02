import { TestBed } from '@angular/core/testing';

import { TankDataService } from './tank-data.service';

describe('TankDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TankDataService = TestBed.get(TankDataService);
    expect(service).toBeTruthy();
  });
});
