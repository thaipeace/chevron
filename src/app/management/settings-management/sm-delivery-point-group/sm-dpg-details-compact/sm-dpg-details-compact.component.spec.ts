import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmDpgDetailsCompactComponent } from './sm-dpg-details-compact.component';

describe('SmDpgDetailsCompactComponent', () => {
  let component: SmDpgDetailsCompactComponent;
  let fixture: ComponentFixture<SmDpgDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDpgDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDpgDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
