import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmOnTransitComponent } from './dm-on-transit.component';

describe('DmOnTransitComponent', () => {
  let component: DmOnTransitComponent;
  let fixture: ComponentFixture<DmOnTransitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmOnTransitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmOnTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
