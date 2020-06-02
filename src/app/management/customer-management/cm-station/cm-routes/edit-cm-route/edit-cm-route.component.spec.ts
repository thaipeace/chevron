import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCmRouteComponent } from './edit-cm-route.component';

describe('EditCmRouteComponent', () => {
  let component: EditCmRouteComponent;
  let fixture: ComponentFixture<EditCmRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCmRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCmRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
