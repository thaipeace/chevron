import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmListDialogComponent } from './nm-list-dialog.component';

describe('NmListDialogComponent', () => {
  let component: NmListDialogComponent;
  let fixture: ComponentFixture<NmListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
