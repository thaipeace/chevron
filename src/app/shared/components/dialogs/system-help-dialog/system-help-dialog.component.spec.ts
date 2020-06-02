import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHelpDialogComponent } from './system-help-dialog.component';

describe('SystemHelpDialogComponent', () => {
  let component: SystemHelpDialogComponent;
  let fixture: ComponentFixture<SystemHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
