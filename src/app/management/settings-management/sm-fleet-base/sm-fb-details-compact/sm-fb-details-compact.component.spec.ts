import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFbDetailsCompactComponent } from './sm-fb-details-compact.component';

describe('SmFbDetailsCompactComponent', () => {
  let component: SmFbDetailsCompactComponent;
  let fixture: ComponentFixture<SmFbDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmFbDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmFbDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
