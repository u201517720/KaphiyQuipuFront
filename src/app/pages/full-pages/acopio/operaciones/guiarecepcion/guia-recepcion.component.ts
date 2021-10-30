import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { DateUtil } from '../../../../../services/util/date-util';

@Component({
  selector: 'app-guia-recepcion',
  templateUrl: './guia-recepcion.component.html',
  styleUrls: ['./guia-recepcion.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaRecepcionComponent implements OnInit {

  frmListGuiaRecepcion: FormGroup;
  errorGeneral = { isError: false, errorMessage: '' };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  limitRef = 10;
  selected: [];
  rows: [];

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil) {
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListGuiaRecepcion = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmListGuiaRecepcion.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmListGuiaRecepcion.controls.fechaFin.setValue(this.dateUtil.currentDate());
  }

  get f() {
    return this.frmListGuiaRecepcion.controls;
  }

  compareTwoDates() {
    const anioFechaInicio = new Date(this.frmListGuiaRecepcion.value.fechaInicio).getFullYear()
    const anioFechaFin = new Date(this.frmListGuiaRecepcion.value.fechaFin).getFullYear()

    if (anioFechaFin < anioFechaInicio) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio' };
      // this.frmListGuiaRecepcion.controls['fechaFin'].setErrors({ isError: true })
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e) {

  }

  filterUpdate(e) {

  }

  buscar() {

  }
}