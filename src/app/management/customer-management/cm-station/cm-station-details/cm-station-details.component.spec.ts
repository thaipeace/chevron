import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmStationDetailsComponent } from './cm-station-details.component';

describe('CmStationDetailsComponent', () => {
  let component: CmStationDetailsComponent;
  let fixture: ComponentFixture<CmStationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
