import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOrderOptimizeDialogComponent } from './om-order-optimize-dialog.component';

describe('OmOrderOptimizeDialogComponent', () => {
  let component: OmOrderOptimizeDialogComponent;
  let fixture: ComponentFixture<OmOrderOptimizeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmOrderOptimizeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmOrderOptimizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
