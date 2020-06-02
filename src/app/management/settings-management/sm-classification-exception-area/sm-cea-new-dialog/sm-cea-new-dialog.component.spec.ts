import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmCeaNewDialogComponent } from './sm-cea-new-dialog.component';

describe('SmCeaNewDialogComponent', () => {
  let component: SmCeaNewDialogComponent;
  let fixture: ComponentFixture<SmCeaNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmCeaNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmCeaNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
