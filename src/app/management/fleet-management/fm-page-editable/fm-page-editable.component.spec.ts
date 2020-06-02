import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmPageEditableComponent } from './fm-page-editable.component';

describe('FmPageEditableComponent', () => {
  let component: FmPageEditableComponent;
  let fixture: ComponentFixture<FmPageEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmPageEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmPageEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
