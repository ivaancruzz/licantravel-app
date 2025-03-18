import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryLayoutComponent } from './category-layout.component';

describe('CategoryLayoutComponent', () => {
  let component: CategoryLayoutComponent;
  let fixture: ComponentFixture<CategoryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
