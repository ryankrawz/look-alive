import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDeckComponent } from './open-deck.component';

describe('OpenDeckComponent', () => {
  let component: OpenDeckComponent;
  let fixture: ComponentFixture<OpenDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
