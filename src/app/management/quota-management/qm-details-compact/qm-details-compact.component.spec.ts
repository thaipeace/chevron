import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmDetailsCompactComponent } from './qm-details-compact.component';

describe('QmDetailsCompactComponent', () => {
  let component: QmDetailsCompactComponent;
  let fixture: ComponentFixture<QmDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
