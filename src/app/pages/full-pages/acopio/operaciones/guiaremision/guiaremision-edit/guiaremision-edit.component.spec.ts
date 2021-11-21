import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaremisionEditComponent } from './guiaremision-edit.component';

describe('GuiaremisionEditComponent', () => {
  let component: GuiaremisionEditComponent;
  let fixture: ComponentFixture<GuiaremisionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaremisionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaremisionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
