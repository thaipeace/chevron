import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintMarkersComponent } from './hint-markers.component';

describe('HintMarkersComponent', () => {
  let component: HintMarkersComponent;
  let fixture: ComponentFixture<HintMarkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintMarkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
