import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPasswordToggleComponent } from './input-password-toggle.component';

describe('InputPasswordToggleComponent', () => {
  let component: InputPasswordToggleComponent;
  let fixture: ComponentFixture<InputPasswordToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPasswordToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasswordToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
