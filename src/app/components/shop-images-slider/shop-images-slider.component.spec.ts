import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopImagesSliderComponent } from './shop-images-slider.component';

describe('ShopImagesSliderComponent', () => {
  let component: ShopImagesSliderComponent;
  let fixture: ComponentFixture<ShopImagesSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopImagesSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopImagesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
