import { TestBed } from '@angular/core/testing';

import { ExceptionAreaDataService } from './exception-area-data.service';

describe('ExceptionAreaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExceptionAreaDataService = TestBed.get(ExceptionAreaDataService);
    expect(service).toBeTruthy();
  });
});
