import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmStationPageComponent } from './cm-station-page.component';

describe('CmStationPageComponent', () => {
  let component: CmStationPageComponent;
  let fixture: ComponentFixture<CmStationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
