import { TestBed } from '@angular/core/testing';

import { FmTreeviewLoadingService } from './fm-treeview-loading.service';

describe('FmTreeviewLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FmTreeviewLoadingService = TestBed.get(FmTreeviewLoadingService);
    expect(service).toBeTruthy();
  });
});
