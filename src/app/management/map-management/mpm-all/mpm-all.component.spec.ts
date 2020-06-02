import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpmAllComponent } from './mpm-all.component';

describe('MpmAllComponent', () => {
  let component: MpmAllComponent;
  let fixture: ComponentFixture<MpmAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpmAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpmAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
