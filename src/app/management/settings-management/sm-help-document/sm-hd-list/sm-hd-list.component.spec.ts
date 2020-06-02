import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHdListComponent } from './sm-hd-list.component';

describe('SmHdListComponent', () => {
  let component: SmHdListComponent;
  let fixture: ComponentFixture<SmHdListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHdListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
