import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTextboxComponent } from './editable-textbox.component';

describe('EditableTextboxComponent', () => {
  let component: EditableTextboxComponent;
  let fixture: ComponentFixture<EditableTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
