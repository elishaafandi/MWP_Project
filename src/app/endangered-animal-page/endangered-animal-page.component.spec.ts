import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndangeredAnimalPageComponent } from './endangered-animal-page.component';

describe('EndangeredAnimalPageComponent', () => {
  let component: EndangeredAnimalPageComponent;
  let fixture: ComponentFixture<EndangeredAnimalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndangeredAnimalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndangeredAnimalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
