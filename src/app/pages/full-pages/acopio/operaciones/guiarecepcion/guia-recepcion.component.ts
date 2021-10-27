import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DateUtil } from '../../../../../services/util/date-util';

@Component({
  selector: 'app-guia-recepcion',
  templateUrl: './guia-recepcion.component.html',
  styleUrls: ['./guia-recepcion.component.scss']
})
export class GuiaRecepcionComponent implements OnInit {

  frmListGuiaRecepcion: FormGroup;
  errorGeneral = { isError: false, errorMessage: '' };
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
  }

  get f() {
    return this.frmListGuiaRecepcion.controls;
  }

  compareTwoDates() {
    var anioFechaInicio = new Date(this.frmListGuiaRecepcion.controls['fechaInicio'].value).getFullYear()
    var anioFechaFin = new Date(this.frmListGuiaRecepcion.controls['fechaFin'].value).getFullYear()

    if (anioFechaFin < anioFechaInicio) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio' };
      this.frmListGuiaRecepcion.controls['fechaFin'].setErrors({ isError: true })
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
