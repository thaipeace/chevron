import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmWindowsNewDialogComponent } from './dm-windows-new-dialog.component';

describe('DmWindowsNewDialogComponent', () => {
  let component: DmWindowsNewDialogComponent;
  let fixture: ComponentFixture<DmWindowsNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmWindowsNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmWindowsNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
