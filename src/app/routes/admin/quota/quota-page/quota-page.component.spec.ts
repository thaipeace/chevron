import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaPageComponent } from './quota-page.component';

describe('QuotaPageComponent', () => {
  let component: QuotaPageComponent;
  let fixture: ComponentFixture<QuotaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
