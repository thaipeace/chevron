/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmStationNewComponent } from './cm-station-new.component';

describe('CmStationNewComponent', () => {
  let component: CmStationNewComponent;
  let fixture: ComponentFixture<CmStationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
