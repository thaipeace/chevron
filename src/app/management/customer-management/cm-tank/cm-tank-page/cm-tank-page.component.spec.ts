import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTankPageComponent } from './cm-tank-page.component';

describe('CmTankPageComponent', () => {
  let component: CmTankPageComponent;
  let fixture: ComponentFixture<CmTankPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTankPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTankPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
