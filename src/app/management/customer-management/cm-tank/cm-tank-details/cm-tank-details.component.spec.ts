import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTankDetailsComponent } from './cm-tank-details.component';

describe('CmTankDetailsComponent', () => {
  let component: CmTankDetailsComponent;
  let fixture: ComponentFixture<CmTankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
