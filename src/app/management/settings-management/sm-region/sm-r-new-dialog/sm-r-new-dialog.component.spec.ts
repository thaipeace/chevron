import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmRNewDialogComponent } from './sm-r-new-dialog.component';

describe('SmRNewDialogComponent', () => {
  let component: SmRNewDialogComponent;
  let fixture: ComponentFixture<SmRNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
