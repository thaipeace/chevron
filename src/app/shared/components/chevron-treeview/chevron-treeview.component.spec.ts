import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevronTreeviewComponent } from './chevron-treeview.component';

describe('ChevronTreeviewComponent', () => {
  let component: ChevronTreeviewComponent;
  let fixture: ComponentFixture<ChevronTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChevronTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChevronTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
