import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundItemsComponent } from './not-found-items.component';

describe('NotFoundItemsComponent', () => {
  let component: NotFoundItemsComponent;
  let fixture: ComponentFixture<NotFoundItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
