import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHdNewDialogComponent } from './sm-hd-new-dialog.component';

describe('SmHdNewDialogComponent', () => {
  let component: SmHdNewDialogComponent;
  let fixture: ComponentFixture<SmHdNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHdNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHdNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
