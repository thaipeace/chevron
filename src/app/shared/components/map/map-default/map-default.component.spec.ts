import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDefaultComponent } from './map-default.component';

describe('MapDefaultComponent', () => {
  let component: MapDefaultComponent;
  let fixture: ComponentFixture<MapDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
