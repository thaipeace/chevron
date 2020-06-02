import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmListComponent } from './um-list.component';

describe('UmListComponent', () => {
  let component: UmListComponent;
  let fixture: ComponentFixture<UmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
