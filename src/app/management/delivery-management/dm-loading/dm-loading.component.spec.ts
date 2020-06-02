import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmLoadingComponent } from './dm-loading.component';

describe('DmLoadingComponent', () => {
  let component: DmLoadingComponent;
  let fixture: ComponentFixture<DmLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
