import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbdMainComponent } from './sbd-main.component';

describe('SbdMainComponent', () => {
  let component: SbdMainComponent;
  let fixture: ComponentFixture<SbdMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbdMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbdMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
