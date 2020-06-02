import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmDpgListComponent } from './sm-dpg-list.component';

describe('SmDpgListComponent', () => {
  let component: SmDpgListComponent;
  let fixture: ComponentFixture<SmDpgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDpgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDpgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
