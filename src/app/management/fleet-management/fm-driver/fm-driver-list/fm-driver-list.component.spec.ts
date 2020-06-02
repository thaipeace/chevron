import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverListComponent } from './fm-driver-list.component';

describe('FmDriverListComponent', () => {
  let component: FmDriverListComponent;
  let fixture: ComponentFixture<FmDriverListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
