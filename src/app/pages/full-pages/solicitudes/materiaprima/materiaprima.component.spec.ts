import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaprimaComponent } from './materiaprima.component';

describe('MateriaprimaComponent', () => {
  let component: MateriaprimaComponent;
  let fixture: ComponentFixture<MateriaprimaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriaprimaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaprimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
