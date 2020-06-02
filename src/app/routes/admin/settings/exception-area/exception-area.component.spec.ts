import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionAreaComponent } from './exception-area.component';

describe('ExceptionAreaComponent', () => {
  let component: ExceptionAreaComponent;
  let fixture: ComponentFixture<ExceptionAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
