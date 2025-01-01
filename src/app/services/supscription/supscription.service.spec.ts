import { TestBed } from '@angular/core/testing';

import { SupscriptionService } from './supscription.service';

describe('SupscriptionService', () => {
  let service: SupscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
