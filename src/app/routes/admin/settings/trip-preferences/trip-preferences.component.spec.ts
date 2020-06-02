import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPreferencesComponent } from './trip-preferences.component';

describe('TripPreferencesComponent', () => {
  let component: TripPreferencesComponent;
  let fixture: ComponentFixture<TripPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
