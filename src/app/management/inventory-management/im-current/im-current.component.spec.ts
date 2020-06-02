import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImCurrentComponent } from './im-current.component';

describe('ImCurrentComponent', () => {
  let component: ImCurrentComponent;
  let fixture: ComponentFixture<ImCurrentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImCurrentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
