import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmDpgNewDialogComponent } from './sm-dpg-new-dialog.component';

describe('SmDpgNewDialogComponent', () => {
  let component: SmDpgNewDialogComponent;
  let fixture: ComponentFixture<SmDpgNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDpgNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDpgNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
