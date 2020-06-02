import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmPageComponent } from './am-page.component';

describe('AmPageComponent', () => {
  let component: AmPageComponent;
  let fixture: ComponentFixture<AmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
