import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmNewComponent } from './om-new.component';

describe('OmNewComponent', () => {
  let component: OmNewComponent;
  let fixture: ComponentFixture<OmNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
