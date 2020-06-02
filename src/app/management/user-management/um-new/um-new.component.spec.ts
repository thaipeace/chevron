import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmNewComponent } from './um-new.component';

describe('UmNewComponent', () => {
  let component: UmNewComponent;
  let fixture: ComponentFixture<UmNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
