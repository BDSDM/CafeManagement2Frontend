import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesgameComponent } from './cookiesgame.component';

describe('CookiesgameComponent', () => {
  let component: CookiesgameComponent;
  let fixture: ComponentFixture<CookiesgameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookiesgameComponent]
    });
    fixture = TestBed.createComponent(CookiesgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
