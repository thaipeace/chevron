import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmAssignOrderDialogComponent } from './sm-assign-order-dialog.component';

describe('SmAssignOrderDialogComponent', () => {
  let component: SmAssignOrderDialogComponent;
  let fixture: ComponentFixture<SmAssignOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmAssignOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmAssignOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
