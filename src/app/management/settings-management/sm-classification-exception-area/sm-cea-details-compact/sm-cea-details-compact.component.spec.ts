import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmCeaDetailsCompactComponent } from './sm-cea-details-compact.component';

describe('SmCeaDetailsCompactComponent', () => {
  let component: SmCeaDetailsCompactComponent;
  let fixture: ComponentFixture<SmCeaDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmCeaDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmCeaDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
