import { TestBed } from '@angular/core/testing';

import { CodeErrorService } from './code-error.service';

describe('CodeErrorService', () => {
  let service: CodeErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
