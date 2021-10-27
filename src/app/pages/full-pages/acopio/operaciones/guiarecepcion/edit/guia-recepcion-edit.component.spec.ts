import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaRecepcionEditComponent } from './guia-recepcion-edit.component';

describe('GuiaRecepcionEditComponent', () => {
  let component: GuiaRecepcionEditComponent;
  let fixture: ComponentFixture<GuiaRecepcionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaRecepcionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaRecepcionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
