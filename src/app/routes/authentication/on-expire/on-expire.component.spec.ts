import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnExpireComponent } from './on-expire.component';

describe('OnExpireComponent', () => {
  let component: OnExpireComponent;
  let fixture: ComponentFixture<OnExpireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnExpireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
