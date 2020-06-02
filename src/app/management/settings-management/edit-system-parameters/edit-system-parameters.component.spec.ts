import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSystemParametersComponent } from './edit-system-parameters.component';

describe('EditSystemParametersComponent', () => {
  let component: EditSystemParametersComponent;
  let fixture: ComponentFixture<EditSystemParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSystemParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSystemParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
