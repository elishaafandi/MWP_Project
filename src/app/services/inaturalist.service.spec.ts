import { TestBed } from '@angular/core/testing';

import { InaturalistService } from './inaturalist.service';

describe('InaturalistService', () => {
  let service: InaturalistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InaturalistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
