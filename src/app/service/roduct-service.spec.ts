import { TestBed } from '@angular/core/testing';

import { RoductService } from './roduct-service';

describe('RoductService', () => {
  let service: RoductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
