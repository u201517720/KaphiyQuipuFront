import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenprocesoComponent } from './ordenproceso.component';

describe('OrdenprocesoComponent', () => {
  let component: OrdenprocesoComponent;
  let fixture: ComponentFixture<OrdenprocesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenprocesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
