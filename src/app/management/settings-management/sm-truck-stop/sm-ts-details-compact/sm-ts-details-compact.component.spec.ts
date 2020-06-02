import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTsDetailsCompactComponent } from './sm-ts-details-compact.component';

describe('SmTsDetailsCompactComponent', () => {
  let component: SmTsDetailsCompactComponent;
  let fixture: ComponentFixture<SmTsDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTsDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTsDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
