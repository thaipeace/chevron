import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTankListComponent } from './cm-tank-list.component';

describe('CmTankListComponent', () => {
  let component: CmTankListComponent;
  let fixture: ComponentFixture<CmTankListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTankListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
