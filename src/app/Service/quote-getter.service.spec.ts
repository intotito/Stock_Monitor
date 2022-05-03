import { TestBed } from '@angular/core/testing';

import { QuoteGetterService } from './quote-getter.service';

describe('QuoteGetterService', () => {
  let service: QuoteGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
