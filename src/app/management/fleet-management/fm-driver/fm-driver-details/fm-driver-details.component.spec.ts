import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverDetailsComponent } from './fm-driver-details.component';

describe('FmDriverDetailsComponent', () => {
  let component: FmDriverDetailsComponent;
  let fixture: ComponentFixture<FmDriverDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
