import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverDetailsDetailComponent } from './fm-driver-details-detail.component';

describe('FmDriverDetailsDetailComponent', () => {
  let component: FmDriverDetailsDetailComponent;
  let fixture: ComponentFixture<FmDriverDetailsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverDetailsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverDetailsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
