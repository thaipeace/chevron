import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComingSoonComponent } from './map-coming-soon.component';

describe('MapComingSoonComponent', () => {
  let component: MapComingSoonComponent;
  let fixture: ComponentFixture<MapComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
