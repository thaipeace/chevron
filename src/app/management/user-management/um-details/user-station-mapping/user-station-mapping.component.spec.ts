import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStationMappingComponent } from './user-station-mapping.component';

describe('UserStationMappingComponent', () => {
  let component: UserStationMappingComponent;
  let fixture: ComponentFixture<UserStationMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStationMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
