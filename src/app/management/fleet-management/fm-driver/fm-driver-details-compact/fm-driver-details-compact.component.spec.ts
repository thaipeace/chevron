import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverDetailsCompactComponent } from './fm-driver-details-compact.component';

describe('FmDriverDetailsCompactComponent', () => {
  let component: FmDriverDetailsCompactComponent;
  let fixture: ComponentFixture<FmDriverDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
