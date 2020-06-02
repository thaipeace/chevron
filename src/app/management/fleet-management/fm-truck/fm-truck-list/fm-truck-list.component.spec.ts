import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckListComponent } from './fm-truck-list.component';

describe('FmTruckListComponent', () => {
  let component: FmTruckListComponent;
  let fixture: ComponentFixture<FmTruckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
