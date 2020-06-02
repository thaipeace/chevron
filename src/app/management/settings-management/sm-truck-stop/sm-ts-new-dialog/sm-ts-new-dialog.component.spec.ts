import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTsNewDialogComponent } from './sm-ts-new-dialog.component';

describe('SmTsNewDialogComponent', () => {
  let component: SmTsNewDialogComponent;
  let fixture: ComponentFixture<SmTsNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTsNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTsNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
