import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmWindowsDetailsCompactComponent } from './dm-windows-details-compact.component';

describe('DmWindowsDetailsCompactComponent', () => {
  let component: DmWindowsDetailsCompactComponent;
  let fixture: ComponentFixture<DmWindowsDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmWindowsDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmWindowsDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
