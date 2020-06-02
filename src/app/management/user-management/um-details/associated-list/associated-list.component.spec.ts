import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociatedList } from './associated-list.component';

describe('RoleTruckCompanyDetailsDialogComponent', () => {
  let component: AssociatedList;
  let fixture: ComponentFixture<AssociatedList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
