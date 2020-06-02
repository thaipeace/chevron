/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmTankNewComponent } from './cm-tank-new.component';

describe('CmTankNewComponent', () => {
  let component: CmTankNewComponent;
  let fixture: ComponentFixture<CmTankNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTankNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTankNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
