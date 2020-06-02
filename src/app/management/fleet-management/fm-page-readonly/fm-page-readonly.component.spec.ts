import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmPageReadonlyComponent } from './fm-page-readonly.component';

describe('FmPageReadonlyComponent', () => {
  let component: FmPageReadonlyComponent;
  let fixture: ComponentFixture<FmPageReadonlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmPageReadonlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmPageReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
