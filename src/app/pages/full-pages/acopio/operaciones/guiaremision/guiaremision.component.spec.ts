import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaremisionComponent } from './guiaremision.component';

describe('GuiaremisionComponent', () => {
  let component: GuiaremisionComponent;
  let fixture: ComponentFixture<GuiaremisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaremisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaremisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
