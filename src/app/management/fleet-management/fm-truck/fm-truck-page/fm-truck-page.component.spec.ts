import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckPageComponent } from './fm-truck-page.component';

describe('FmTruckPageComponent', () => {
  let component: FmTruckPageComponent;
  let fixture: ComponentFixture<FmTruckPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
