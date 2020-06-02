import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHlNewDialogComponent } from './sm-hl-new-dialog.component';

describe('SmHlNewDialogComponent', () => {
  let component: SmHlNewDialogComponent;
  let fixture: ComponentFixture<SmHlNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHlNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHlNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
