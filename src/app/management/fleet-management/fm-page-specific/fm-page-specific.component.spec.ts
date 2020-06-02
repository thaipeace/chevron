import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmPageSpecificComponent } from './fm-page-specific.component';

describe('FmPageSpecificComponent', () => {
  let component: FmPageSpecificComponent;
  let fixture: ComponentFixture<FmPageSpecificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmPageSpecificComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmPageSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
