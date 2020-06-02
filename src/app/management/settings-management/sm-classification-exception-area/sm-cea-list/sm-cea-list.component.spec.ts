import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmCeaListComponent } from './sm-cea-list.component';

describe('SmCeaListComponent', () => {
  let component: SmCeaListComponent;
  let fixture: ComponentFixture<SmCeaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmCeaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmCeaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
