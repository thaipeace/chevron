import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRoutesComponent } from './cm-routes.component';

describe('CmRoutesComponent', () => {
  let component: CmRoutesComponent;
  let fixture: ComponentFixture<CmRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
