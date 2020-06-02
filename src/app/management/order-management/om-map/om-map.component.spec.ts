import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmMapComponent } from './om-map.component';

describe('OmMapComponent', () => {
  let component: OmMapComponent;
  let fixture: ComponentFixture<OmMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
