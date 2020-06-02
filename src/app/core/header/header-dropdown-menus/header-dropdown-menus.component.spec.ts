import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDropdownMenusComponent } from './header-dropdown-menus.component';

describe('HeaderDropdownMenusComponent', () => {
  let component: HeaderDropdownMenusComponent;
  let fixture: ComponentFixture<HeaderDropdownMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderDropdownMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDropdownMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
