import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelLayoutComponent } from './user-panel-layout.component';

describe('UserPanelLayoutComponent', () => {
  let component: UserPanelLayoutComponent;
  let fixture: ComponentFixture<UserPanelLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
