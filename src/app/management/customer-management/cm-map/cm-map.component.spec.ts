import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMapComponent } from './cm-map.component';

describe('CmMapComponent', () => {
  let component: CmMapComponent;
  let fixture: ComponentFixture<CmMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
