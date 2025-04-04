import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailsProductComponent } from './thumbnails-product.component';

describe('ThumbnailsProductComponent', () => {
  let component: ThumbnailsProductComponent;
  let fixture: ComponentFixture<ThumbnailsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailsProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
