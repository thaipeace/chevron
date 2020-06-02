import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmUnloadingComponent } from './dm-unloading.component';

describe('DmUnloadingComponent', () => {
  let component: DmUnloadingComponent;
  let fixture: ComponentFixture<DmUnloadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmUnloadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
