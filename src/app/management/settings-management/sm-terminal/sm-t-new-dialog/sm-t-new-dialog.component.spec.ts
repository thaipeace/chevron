import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTNewDialogComponent } from './sm-t-new-dialog.component';

describe('SmTNewDialogComponent', () => {
  let component: SmTNewDialogComponent;
  let fixture: ComponentFixture<SmTNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
