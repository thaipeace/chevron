import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFbNewDialogComponent } from './sm-fb-new-dialog.component';

describe('SmFbNewDialogComponent', () => {
  let component: SmFbNewDialogComponent;
  let fixture: ComponentFixture<SmFbNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmFbNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmFbNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
