import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSliderComponent } from './ticket-slider.component';

describe('TicketSliderComponent', () => {
  let component: TicketSliderComponent;
  let fixture: ComponentFixture<TicketSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
