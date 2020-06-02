import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorCustomComponent } from './paginator-custom.component';

describe('PaginatorCustomComponent', () => {
  let component: PaginatorCustomComponent;
  let fixture: ComponentFixture<PaginatorCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginatorCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
