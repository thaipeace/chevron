import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckEventListComponent } from './fm-truck-event-list.component';

describe('FmTruckEventListComponent', () => {
  let component: FmTruckEventListComponent;
  let fixture: ComponentFixture<FmTruckEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
