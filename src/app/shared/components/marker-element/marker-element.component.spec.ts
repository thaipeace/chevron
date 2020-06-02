import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerElementComponent } from './marker-element.component';

describe('MarkerElementComponent', () => {
  let component: MarkerElementComponent;
  let fixture: ComponentFixture<MarkerElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
