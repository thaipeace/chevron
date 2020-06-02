import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTreeviewComponent } from './cm-treeview.component';

describe('CmTreeviewComponent', () => {
  let component: CmTreeviewComponent;
  let fixture: ComponentFixture<CmTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
