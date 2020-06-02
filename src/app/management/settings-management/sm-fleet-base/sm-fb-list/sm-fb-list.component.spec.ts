import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFbListComponent } from './sm-fb-list.component';

describe('SmFbListComponent', () => {
  let component: SmFbListComponent;
  let fixture: ComponentFixture<SmFbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmFbListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmFbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
