import { TestBed } from '@angular/core/testing';

import { IntegrationServicesService } from './integration-services.service';

describe('IntegrationServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntegrationServicesService = TestBed.get(IntegrationServicesService);
    expect(service).toBeTruthy();
  });
});
