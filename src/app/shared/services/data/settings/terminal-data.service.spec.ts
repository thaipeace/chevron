import { TestBed } from '@angular/core/testing';

import { TerminalDataService } from './terminal-data.service';

describe('TerminalDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TerminalDataService = TestBed.get(TerminalDataService);
    expect(service).toBeTruthy();
  });
});
