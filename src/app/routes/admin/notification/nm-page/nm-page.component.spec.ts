import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmPageComponent } from './nm-page.component';

describe('OmPageComponent', () => {
  let component: OmPageComponent;
  let fixture: ComponentFixture<OmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
