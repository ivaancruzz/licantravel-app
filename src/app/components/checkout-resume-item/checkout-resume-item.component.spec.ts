import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutResumeItemComponent } from './checkout-resume-item.component';

describe('CheckoutResumeItemComponent', () => {
  let component: CheckoutResumeItemComponent;
  let fixture: ComponentFixture<CheckoutResumeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutResumeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutResumeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
