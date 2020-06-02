import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNumbersComponent } from './contact-numbers.component';

describe('ContactNumbersComponent', () => {
  let component: ContactNumbersComponent;
  let fixture: ComponentFixture<ContactNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactNumbersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
