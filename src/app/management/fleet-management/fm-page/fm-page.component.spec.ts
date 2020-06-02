import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmPageComponent } from './fm-page.component';

describe('FmPageComponent', () => {
  let component: FmPageComponent;
  let fixture: ComponentFixture<FmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
