import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfirmEmailComponent } from './alert-confirm-email.component';

describe('AlertConfirmEmailComponent', () => {
  let component: AlertConfirmEmailComponent;
  let fixture: ComponentFixture<AlertConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertConfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
