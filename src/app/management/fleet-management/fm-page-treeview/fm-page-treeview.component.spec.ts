import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmPageTreeviewComponent } from './fm-page-treeview.component';

describe('FmPageTreeviewComponent', () => {
  let component: FmPageTreeviewComponent;
  let fixture: ComponentFixture<FmPageTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmPageTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmPageTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
