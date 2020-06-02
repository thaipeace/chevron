import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmStationListComponent } from './cm-station-list.component';

describe('CmStationListComponent', () => {
  let component: CmStationListComponent;
  let fixture: ComponentFixture<CmStationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
