import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmWindowsComponent } from './dm-windows.component';

describe('DmWindowsComponent', () => {
  let component: DmWindowsComponent;
  let fixture: ComponentFixture<DmWindowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmWindowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
