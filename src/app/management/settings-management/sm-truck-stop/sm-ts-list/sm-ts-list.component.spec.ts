import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTsListComponent } from './sm-ts-list.component';

describe('SmTsListComponent', () => {
  let component: SmTsListComponent;
  let fixture: ComponentFixture<SmTsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
