import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverProfileComponent } from './fm-driver-profile.component';

describe('FmDriverProfileComponent', () => {
  let component: FmDriverProfileComponent;
  let fixture: ComponentFixture<FmDriverProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
