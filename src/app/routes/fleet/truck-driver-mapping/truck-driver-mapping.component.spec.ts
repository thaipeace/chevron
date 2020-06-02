import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDriverMappingComponent } from './truck-driver-mapping.component';

describe('TruckDriverMappingComponent', () => {
  let component: TruckDriverMappingComponent;
  let fixture: ComponentFixture<TruckDriverMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDriverMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDriverMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
