import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmSpListComponent } from './sm-sp-list.component';

describe('SmSpListComponent', () => {
  let component: SmSpListComponent;
  let fixture: ComponentFixture<SmSpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
