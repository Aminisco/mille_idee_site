import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { appConfig } from './app.config';

describe('appConfig router', () => {
  it('reloads a same-URL navigation so a repeated #fragment link scrolls again', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    expect(TestBed.inject(Router).onSameUrlNavigation).toBe('reload');
  });
});
