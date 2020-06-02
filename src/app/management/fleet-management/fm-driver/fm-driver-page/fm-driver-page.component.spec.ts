import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverPageComponent } from './fm-driver-page.component';

describe('FmDriverPageComponent', () => {
  let component: FmDriverPageComponent;
  let fixture: ComponentFixture<FmDriverPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
