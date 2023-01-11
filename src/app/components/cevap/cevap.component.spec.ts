/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CevapComponent } from './cevap.component';

describe('CevapComponent', () => {
  let component: CevapComponent;
  let fixture: ComponentFixture<CevapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CevapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CevapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
