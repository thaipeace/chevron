import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmSpNewDialogComponent } from './sm-sp-new-dialog.component';

describe('SmSpNewDialogComponent', () => {
  let component: SmSpNewDialogComponent;
  let fixture: ComponentFixture<SmSpNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSpNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSpNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
