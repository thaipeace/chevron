import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverDeleteDialogComponent } from './fm-driver-delete-dialog.component';

describe('FmDriverDeleteDialogComponent', () => {
  let component: FmDriverDeleteDialogComponent;
  let fixture: ComponentFixture<FmDriverDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
