/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QmNewComponent } from './qm-new.component';

describe('QmNewComponent', () => {
  let component: QmNewComponent;
  let fixture: ComponentFixture<QmNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
