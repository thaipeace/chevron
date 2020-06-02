import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderStatusComponent } from './page-header-status.component';

describe('PageHeaderStatusComponent', () => {
  let component: PageHeaderStatusComponent;
  let fixture: ComponentFixture<PageHeaderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHeaderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
