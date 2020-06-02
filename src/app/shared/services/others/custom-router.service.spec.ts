import { TestBed } from '@angular/core/testing';

import { CustomRouterService } from './custom-router.service';

describe('CustomRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomRouterService = TestBed.get(CustomRouterService);
    expect(service).toBeTruthy();
  });
});
