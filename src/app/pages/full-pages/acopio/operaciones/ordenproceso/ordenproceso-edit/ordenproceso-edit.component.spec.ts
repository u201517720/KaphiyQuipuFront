import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenprocesoEditComponent } from './ordenproceso-edit.component';

describe('OrdenprocesoEditComponent', () => {
  let component: OrdenprocesoEditComponent;
  let fixture: ComponentFixture<OrdenprocesoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenprocesoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenprocesoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
